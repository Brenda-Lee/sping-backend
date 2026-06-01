package com.attus.users.web;

import com.attus.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    private static final String VALID_BODY = """
            {
              "nome": "Joao Teste",
              "email": "joao.teste@email.com",
              "cpf": "33662965003",
              "telefone": "85999999999",
              "tipoTelefone": "CELULAR",
              "dataNascimento": "01/01/1990"
            }
            """;

    @Test
    void createReturns201AndGeneratedId() throws Exception {
        mockMvc.perform(post("/users").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nome").value("Joao Teste"))
                .andExpect(jsonPath("$.tipoTelefone").value("CELULAR"));
    }

    @Test
    void createWithInvalidEmailReturns400() throws Exception {
        String invalid = VALID_BODY.replace("joao.teste@email.com", "nao-eh-email");
        mockMvc.perform(post("/users").contentType(MediaType.APPLICATION_JSON).content(invalid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").isNotEmpty());
    }

    @Test
    void fullCrudLifecycle() throws Exception {
        MvcResult created = mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode node = objectMapper.readTree(created.getResponse().getContentAsString());
        String id = node.get("id").asText();

        mockMvc.perform(get("/users/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("joao.teste@email.com"));

        String updated = VALID_BODY.replace("Joao Teste", "Joao Atualizado");
        mockMvc.perform(put("/users/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON).content(updated))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Joao Atualizado"));

        mockMvc.perform(get("/users").param("nome:contains", "Atualizado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(delete("/users/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/users/{id}", id))
                .andExpect(status().isNotFound());
    }
}
