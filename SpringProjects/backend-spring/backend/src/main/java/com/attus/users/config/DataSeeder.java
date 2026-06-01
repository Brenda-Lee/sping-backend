package com.attus.users.config;

import com.attus.users.domain.PhoneType;
import com.attus.users.domain.User;
import com.attus.users.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Popula a base com alguns usuarios de exemplo apenas quando a tabela
 * esta vazia (idempotente entre reinicios). Desativado no perfil de teste.
 */
@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository repository;

    public DataSeeder(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        repository.saveAll(List.of(
                novo("Clara", "joao@email.com", "33662965003", "85999999999", PhoneType.CELULAR),
                novo("Maria Souza", "maria@email.com", "94014281078", "85988888888", PhoneType.FIXO),
                novo("Heloise Vergara", "heloiseVergara@gmail.com", "92393781030", "0000000000", PhoneType.CELULAR)
        ));
    }

    private User novo(String nome, String email, String cpf, String telefone, PhoneType tipo) {
        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setCpf(cpf);
        user.setTelefone(telefone);
        user.setTipoTelefone(tipo);
        return user;
    }
}
