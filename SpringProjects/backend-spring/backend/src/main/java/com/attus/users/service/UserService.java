package com.attus.users.service;

import com.attus.users.domain.User;
import com.attus.users.repository.UserRepository;
import com.attus.users.web.dto.UserRequest;
import com.attus.users.web.dto.UserResponse;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserService {

    private static final Sort ORDER_BY_NOME = Sort.by(Sort.Direction.ASC, "nome");

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UserResponse> list(String nomeContains) {
        List<User> users = (nomeContains == null || nomeContains.isBlank())
                ? repository.findAll(ORDER_BY_NOME)
                : repository.findByNomeContainingIgnoreCase(nomeContains.trim(), ORDER_BY_NOME);
        return users.stream().map(UserResponse::from).toList();
    }

    public UserResponse findById(String id) {
        return repository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> notFound(id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        User user = new User();
        apply(user, request);
        return UserResponse.from(repository.save(user));
    }

    @Transactional
    public UserResponse update(String id, UserRequest request) {
        User user = repository.findById(id).orElseThrow(() -> notFound(id));
        apply(user, request);
        return UserResponse.from(repository.save(user));
    }

    @Transactional
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw notFound(id);
        }
        repository.deleteById(id);
    }

    private void apply(User user, UserRequest request) {
        user.setNome(request.nome());
        user.setEmail(request.email());
        user.setCpf(request.cpf());
        user.setTelefone(request.telefone());
        user.setTipoTelefone(request.tipoTelefone());
        user.setDataNascimento(request.dataNascimento());
    }

    private ResourceNotFoundException notFound(String id) {
        return new ResourceNotFoundException("Usuario nao encontrado: " + id);
    }
}
