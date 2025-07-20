package com.garbim.gbrs.controller;

import com.garbim.gbrs.dto.TijoloDTO;
import com.garbim.gbrs.dto.RelatorioTijoloDTO;
import com.garbim.gbrs.model.Tijolo;
import com.garbim.gbrs.service.TijoloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tijolos")
@RequiredArgsConstructor
public class TijoloController {

    private final TijoloService tijoloService;

    @GetMapping
    public List<TijoloDTO> lista() {
        return tijoloService.toDTOList(tijoloService.listarTodos());
    }

    @GetMapping("/cores/{cor}")
    public List<TijoloDTO> listaPorCor(@PathVariable String cor) {
        return tijoloService.toDTOList(tijoloService.listarPorCor(cor));
    }

    @GetMapping("/furos/{furos}")
    public List<TijoloDTO> listaPorFuros(@PathVariable String furos) {
        return tijoloService.toDTOList(tijoloService.listarPorFuros(furos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TijoloDTO> buscarPorId(@PathVariable Long id) {
        return tijoloService.buscarPorId(id)
                .map(tijoloService::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TijoloDTO> criar(@RequestBody Tijolo tijolo) {
        Tijolo salvo = tijoloService.salvar(tijolo);
        return ResponseEntity.status(HttpStatus.CREATED).body(tijoloService.toDTO(salvo));
    }

    @PostMapping("/aleatorio")
    public ResponseEntity<TijoloDTO> criarTijoloAleatorio() {
        TijoloDTO tijoloDTO = tijoloService.gerarTijoloAleatorioDTO();
        TijoloDTO salvo = tijoloService.salvarDTO(tijoloDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TijoloDTO> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        Tijolo atualizado = tijoloService.atualizarStatus(id, status);
        return ResponseEntity.ok(tijoloService.toDTO(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tijoloService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorio")
    public RelatorioTijoloDTO relatorio() {
      return tijoloService.gerarRelatorio();
    }
}
