package com.attus.users.web.dto;

import com.attus.users.domain.PhoneType;
import com.attus.users.domain.User;

/**
 * Representacao de saida do usuario, no mesmo formato esperado pelo
 * frontend Angular (id como string, mesmos nomes de campo).
 */
public record UserResponse(
        String id,
        String nome,
        String email,
        String cpf,
        String telefone,
        PhoneType tipoTelefone,
        String dataNascimento
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getCpf(),
                user.getTelefone(),
                user.getTipoTelefone(),
                user.getDataNascimento()
        );
    }
}
