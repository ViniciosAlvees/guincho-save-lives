package br.com.fiap.guincho.controller;

import br.com.fiap.guincho.dominio.Solicitacao;
import br.com.fiap.guincho.service.SolicitacaoService;
import br.com.fiap.guincho.security.EmployeeSessions;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;
    private final EmployeeSessions sessions;

    public SolicitacaoController(SolicitacaoService solicitacaoService, EmployeeSessions sessions) {
        this.solicitacaoService = solicitacaoService;
        this.sessions = sessions;
    }

    @PostMapping
    public ResponseEntity<Object> salvar(@RequestBody Solicitacao solicitacao) {
        solicitacaoService.adicionar(solicitacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @GetMapping
    public ResponseEntity<ArrayList<Solicitacao>> obterTodasSolicitacoes(@RequestHeader(value = "Authorization", required = false) String authorization) {
        sessions.requireAuthorization(authorization);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(solicitacaoService.obterTodasSolicitacoes());
    }
}
