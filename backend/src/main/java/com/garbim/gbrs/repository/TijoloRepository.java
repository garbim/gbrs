package com.garbim.gbrs.repository;

import com.garbim.gbrs.model.Tijolo;
import com.garbim.gbrs.model.TijoloStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TijoloRepository extends JpaRepository<Tijolo, Long> {

    long countByCor(String cor);

    long countByStatus(TijoloStatus status);

    long countByDefeituosoTrue();

    // Paridade 0 = par, 1 = ímpar
    @Query("SELECT COUNT(t) FROM Tijolo t WHERE t.cor = :cor AND MOD(CAST(t.furos AS int), 2) = :paridade")
    long countByCorAndFurosParidade(@Param("cor") String cor, @Param("paridade") int paridade);
}
