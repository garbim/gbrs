package com.garbim.gbrs.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Random;

@Entity
@Table(name = "tijolos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tijolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cor;

    private String furos;

    @Enumerated(EnumType.STRING)
    private TijoloStatus status;

    private Boolean defeituoso;

    public void aprovar() {
        if (status != TijoloStatus.EM_INSPECAO) {
            throw new IllegalStateException("Tijolo já foi avaliado!");
        }
        this.status = TijoloStatus.APROVADO;
        this.defeituoso = new Random().nextInt(3) == 0; // 1 em 3 chance
    }

    public void reprovar() {
        if (status != TijoloStatus.EM_INSPECAO) {
            throw new IllegalStateException("Tijolo já foi avaliado.");
        }
        this.status = TijoloStatus.REPROVADO;
        this.defeituoso = false;
    }

    public boolean podeSerDeletado() {
        return status == TijoloStatus.APROVADO && defeituoso;
    }

}
