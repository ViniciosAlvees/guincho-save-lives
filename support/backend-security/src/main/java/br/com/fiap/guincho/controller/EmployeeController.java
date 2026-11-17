package br.com.fiap.guincho.controller;

import br.com.fiap.guincho.dominio.Solicitacao;
import br.com.fiap.guincho.security.EmployeeSessions;
import br.com.fiap.guincho.service.SolicitacaoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/funcionarios")
public class EmployeeController {
    public record LoginInput(String pin) { }
    private final EmployeeSessions sessions;
    private final SolicitacaoService solicitacaoService;

    public EmployeeController(EmployeeSessions sessions, SolicitacaoService solicitacaoService) {
        this.sessions = sessions;
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping("/sessao")
    public ResponseEntity<EmployeeSessions.Session> login(@RequestBody LoginInput input, HttpServletRequest request) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(sessions.login(input.pin(), request.getRemoteAddr()));
    }

    @GetMapping("/solicitacoes")
    public ResponseEntity<ArrayList<Solicitacao>> requests(@RequestHeader(value = "Authorization", required = false) String authorization) {
        sessions.requireAuthorization(authorization);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(solicitacaoService.obterTodasSolicitacoes());
    }

    @DeleteMapping("/sessao")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        sessions.logout(authorization);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }
}
