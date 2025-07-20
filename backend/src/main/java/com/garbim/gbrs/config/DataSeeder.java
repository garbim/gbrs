package com.garbim.gbrs.config;

import com.garbim.gbrs.dto.TijoloDTO;
import com.garbim.gbrs.model.Tijolo;
import com.garbim.gbrs.model.TijoloStatus;
import com.garbim.gbrs.repository.TijoloRepository;
import com.garbim.gbrs.service.TijoloService;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

  private final TijoloService tijoloService;

  @Override
  public void run(ApplicationArguments args) throws Exception {
      if (tijoloService.count() == 0) {
          for (int i = 0; i < 100; i++) {
              TijoloDTO dto = tijoloService.gerarTijoloAleatorioDTO();
              tijoloService.salvarDTO(dto);
          }
      }
  }
}

