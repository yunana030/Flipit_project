package org.hyn.flipit_pro.repository;

import org.hyn.flipit_pro.domain.PlayRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface PlayRecordRepository extends JpaRepository<PlayRecord, Long> {
    @Query("SELECT p FROM PlayRecord p JOIN FETCH p.user " +
           "ORDER BY p.beststage DESC, p.clickCount ASC, p.createTime ASC")
    List<PlayRecord> findAllOrderByBestRecord();

    @Query("SELECT p FROM PlayRecord p WHERE p.user.id = :userId")
    Optional<PlayRecord> findByUserId(@Param("userId") Long userId);
    boolean existsByUserId(Long userId);
    void deleteByUserId(Long userId);
}