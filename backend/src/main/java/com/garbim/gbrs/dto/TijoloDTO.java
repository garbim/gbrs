package com.garbim.gbrs.dto;

import com.garbim.gbrs.model.TijoloStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TijoloDTO {
    private Long id;
    private String cor;
    private String furos;
    private TijoloStatus status;
    private Boolean defeituoso;

    // Método para converter entidade para DTO
    public static TijoloDTO fromEntity(com.garbim.gbrs.model.Tijolo tijolo) {
        return TijoloDTO.builder()
                .id(tijolo.getId())
                .cor(tijolo.getCor())
                .furos(tijolo.getFuros())
                .status(tijolo.getStatus())
                .defeituoso(tijolo.getDefeituoso())
                .build();
    }

    // Método para converter DTO para entidade (útil para criação e edição)
    public com.garbim.gbrs.model.Tijolo toEntity() {
        return com.garbim.gbrs.model.Tijolo.builder()
                .id(this.id)
                .cor(this.cor)
                .furos(this.furos)
                .status(this.status)
                .defeituoso(this.defeituoso)
                .build();
    }
}
