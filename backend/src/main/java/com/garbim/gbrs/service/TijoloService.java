package com.garbim.gbrs.service;

import com.garbim.gbrs.dto.RelatorioTijoloDTO;
import com.garbim.gbrs.dto.TijoloDTO;
import com.garbim.gbrs.model.Tijolo;
import com.garbim.gbrs.model.TijoloStatus;
import com.garbim.gbrs.repository.TijoloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TijoloService {

    private static final String[] CORES = { "branco", "preto" };
    private final TijoloRepository tijoloRepository;
    private final Random random = new Random();

    public TijoloService(TijoloRepository tijoloRepository) {
        this.tijoloRepository = tijoloRepository;
    }

    // Contagem total
    public long count() {
        return tijoloRepository.count();
    }

    // Listar todos tijolos como entidade
    public List<Tijolo> listarTodos() {
        return tijoloRepository.findAll();
    }

    // Listar por cor (entidade)
    public List<Tijolo> listarPorCor(String cor) {
        return tijoloRepository.findAll().stream()
                .filter(t -> t.getCor().equalsIgnoreCase(cor))
                .toList();
    }

    // Listar por furos (entidade)
    public List<Tijolo> listarPorFuros(String furos) {
        return tijoloRepository.findAll().stream()
                .filter(t -> t.getFuros().equals(furos))
                .toList();
    }

    // Buscar por id (entidade)
    public Optional<Tijolo> buscarPorId(Long id) {
        return tijoloRepository.findById(id);
    }

    // Salvar entidade Tijolo diretamente (usado pelo Seeder)
    public Tijolo salvar(Tijolo tijolo) {
        tijolo.setStatus(TijoloStatus.EM_INSPECAO);
        return tijoloRepository.save(tijolo);
    }

    // Atualizar status usando String (converte para enum)
    public Tijolo atualizarStatus(Long id, String novoStatusStr) {
        TijoloStatus novoStatus;
        try {
            novoStatus = TijoloStatus.valueOf(novoStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status inválido: " + novoStatusStr);
        }
        return atualizarStatus(id, novoStatus);
    }

    // Atualizar status usando enum
    public Tijolo atualizarStatus(Long id, TijoloStatus novoStatus) {
        Tijolo tijolo = tijoloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tijolo não encontrado"));

        if (tijolo.getStatus() == TijoloStatus.APROVADO || tijolo.getStatus() == TijoloStatus.REPROVADO) {
            throw new IllegalStateException("O status não pode ser alterado após aprovação ou reprovação.");
        }

        tijolo.setStatus(novoStatus);

        if (novoStatus == TijoloStatus.APROVADO) {
            tijolo.setDefeituoso(random.nextInt(3) == 0); // 1 em 3 de chance
        }

        return tijoloRepository.save(tijolo);
    }

    // Deletar tijolo respeitando regras
    public void deletar(Long id) {
        Tijolo tijolo = tijoloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tijolo não encontrado"));

        if (tijolo.getStatus() == TijoloStatus.REPROVADO) {
            throw new IllegalStateException("Tijolos reprovados não podem ser deletados.");
        }

        if (!Boolean.TRUE.equals(tijolo.getDefeituoso())) {
            throw new IllegalStateException("Somente tijolos com defeito podem ser deletados.");
        }

        tijoloRepository.delete(tijolo);
    }

    // Métodos de conversão DTO <-> Entity

    public Tijolo fromDTO(TijoloDTO dto) {
        return Tijolo.builder()
                .id(dto.getId())
                .cor(dto.getCor())
                .furos(dto.getFuros())
                .status(dto.getStatus())
                .defeituoso(dto.getDefeituoso())
                .build();
    }

    public TijoloDTO toDTO(Tijolo tijolo) {
        TijoloDTO dto = new TijoloDTO();
        dto.setId(tijolo.getId());
        dto.setCor(tijolo.getCor());
        dto.setFuros(tijolo.getFuros());
        dto.setStatus(tijolo.getStatus());
        dto.setDefeituoso(tijolo.getDefeituoso());
        return dto;
    }

    // Gerar tijolo aleatório DTO (usado pelo Seeder e Controller)
    public TijoloDTO gerarTijoloAleatorioDTO() {
        TijoloDTO dto = new TijoloDTO();
        dto.setCor(CORES[random.nextInt(CORES.length)]);
        dto.setFuros(String.valueOf(random.nextInt(8) + 1));
        dto.setStatus(TijoloStatus.EM_INSPECAO);
        dto.setDefeituoso(false);
        return dto;
    }

    // Salvar DTO convertendo para entidade e retornando DTO salvo
    public TijoloDTO salvarDTO(TijoloDTO dto) {
        Tijolo tijolo = fromDTO(dto);
        tijolo.setStatus(TijoloStatus.EM_INSPECAO); // garante status padrão
        Tijolo salvo = tijoloRepository.save(tijolo);
        return toDTO(salvo);
    }

    public List<TijoloDTO> toDTOList(List<Tijolo> tijolos) {
        return tijolos.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    // Gerar relatório conforme seu DTO de relatório
    public RelatorioTijoloDTO gerarRelatorio() {
        return new RelatorioTijoloDTO(
                tijoloRepository.countByCorAndFurosParidade("branco", 0),
                tijoloRepository.countByCorAndFurosParidade("branco", 1),
                tijoloRepository.countByCorAndFurosParidade("preto", 0),
                tijoloRepository.countByCorAndFurosParidade("preto", 1),
                tijoloRepository.countByCor("branco"),
                tijoloRepository.countByCor("preto"),
                tijoloRepository.countByStatus(TijoloStatus.EM_INSPECAO),
                tijoloRepository.countByStatus(TijoloStatus.APROVADO),
                tijoloRepository.countByStatus(TijoloStatus.REPROVADO),
                tijoloRepository.countByDefeituosoTrue()
        );
    }
}
