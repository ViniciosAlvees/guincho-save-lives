package br.com.fiap.guincho.security;

import br.com.fiap.guincho.controller.GuincheiroController;
import br.com.fiap.guincho.controller.SolicitacaoController;
import br.com.fiap.guincho.handler.ApiExceptionHandler;
import br.com.fiap.guincho.service.GuincheiroService;
import br.com.fiap.guincho.service.SolicitacaoService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.time.Clock;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ApiSecurityTest {
    private MockMvc mvc(Object controller) {
        return MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ApiExceptionHandler()).build();
    }

    @Test void internalErrorsNeverReturnSqlOrCredentials() throws Exception {
        GuincheiroService service = mock(GuincheiroService.class);
        when(service.obterTodosGuincheiros()).thenThrow(new RuntimeException("ORA-TEST SQL_INTERNAL_TEST_SENTINEL"));
        mvc(new GuincheiroController(service)).perform(get("/guincheiros"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().string(not(containsString("ORA-TEST"))))
                .andExpect(content().string(not(containsString("SQL_INTERNAL_TEST_SENTINEL"))))
                .andExpect(header().string("Cache-Control", "no-store"));
    }

    @Test void postErrorsNeverReturnOriginalException() throws Exception {
        GuincheiroService service = mock(GuincheiroService.class);
        doThrow(new RuntimeException("SQL_INTERNAL_TEST_SENTINEL")).when(service).adicionar(any());
        mvc(new GuincheiroController(service)).perform(post("/guincheiros").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isInternalServerError()).andExpect(content().string(not(containsString("SQL_INTERNAL_TEST_SENTINEL"))));
    }

    @Test void invalidJsonIsBadRequest() throws Exception {
        mvc(new GuincheiroController(mock(GuincheiroService.class)))
                .perform(post("/guincheiros").contentType(MediaType.APPLICATION_JSON).content("{invalid"))
                .andExpect(status().isBadRequest()).andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test void requestListIsNotPublicAndNeverTouchesDatabaseWithoutSession() throws Exception {
        SolicitacaoService service = mock(SolicitacaoService.class);
        mvc(new SolicitacaoController(service, new EmployeeSessions("", Clock.systemUTC())))
                .perform(get("/solicitacoes")).andExpect(status().isUnauthorized());
        verifyNoInteractions(service);
    }
}
