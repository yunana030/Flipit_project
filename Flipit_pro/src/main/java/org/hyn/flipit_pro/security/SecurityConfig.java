package org.hyn.flipit_pro.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.security.jwt.JwtAuthorizationFilter;
import org.hyn.flipit_pro.security.jwt.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                    // 최우선 허용 목록
                    .requestMatchers("/error", "/favicon.ico").permitAll()
                    .requestMatchers("/api/authentication/**", "/api/auth/**", "/api/public/**").permitAll()
                    .requestMatchers("/api/stage/**", "/api/cards/**", "/api/play-record/**").permitAll()
                    .requestMatchers("/api/user/me").permitAll()

                    // 권한이 필요한 경로 (범위를 구체적으로)
                    .requestMatchers("/api/admin/**", "/api/cards/admin/**").hasAuthority("ROLE_ADMIN")
                    .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // 권한 체크 방식 확인 필요

                    // 나머지는 인증 필요
                    .anyRequest().authenticated()
                )

                // JWT 필터는 UsernamePasswordAuthenticationFilter 전에 추가
                .addFilterBefore(new JwtAuthorizationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) ->
                                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "인증 필요"))
                        .accessDeniedHandler((req, res, accessEx) ->
                                res.sendError(HttpServletResponse.SC_FORBIDDEN, "권한 없음"))
                );

        return http.build();
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
