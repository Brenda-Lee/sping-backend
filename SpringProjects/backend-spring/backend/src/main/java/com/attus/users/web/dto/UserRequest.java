package com.attus.users.web.dto;

import com.attus.users.domain.PhoneType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Corpo de entrada para criar/editar usuario. O campo "id" eventualmente
 * enviado pelo frontend e ignorado: o id e sempre gerado pelo servidor.
 */
public record UserRequest(

        @NotBlank(message = "Nome e obrigatorio")
        @Size(min = 3, message = "Nome deve ter ao menos 3 caracteres")
        String nome,

        @NotBlank(message = "Email e obrigatorio")
        @Email(message = "Email invalido")
        String email,

        @NotBlank(message = "CPF e obrigatorio")
        String cpf,

        @NotBlank(message = "Telefone e obrigatorio")
        @Size(min = 10, message = "Telefone deve ter ao menos 10 digitos")
        String telefone,

        @NotNull(message = "Tipo de telefone e obrigatorio")
        PhoneType tipoTelefone,

        String dataNascimento
) {
}
