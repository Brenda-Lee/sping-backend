package com.attus.users.repository;

import com.attus.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

    List<User> findByNomeContainingIgnoreCase(String nome, Sort sort);
}
