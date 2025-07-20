package com.garbim.gbrs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioTijoloDTO {
    private long brancosFurosPares;
    private long brancosFurosImpares;
    private long pretosFurosPares;
    private long pretosFurosImpares;
    private long totalBrancos;
    private long totalPretos;
    private long totalEmInspecao;
    private long totalAprovados;
    private long totalReprovados;
    private long totalDefeituosos;
}
