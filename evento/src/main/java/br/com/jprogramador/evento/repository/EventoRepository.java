package br.com.jprogramador.evento.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.jprogramador.evento.entity.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {

	
}
	/*O que o repository faz?
	 * ele será responsável por acessar o banco de dados.
	 * Com essa interface você já ganha métodos prontos como:
	 * save()
	 * findAll()
	 * findById()
	 * delete()
	 * ou seja, ainda sem escrever SQL manualmente, você já consegue:
	 * salvar evento
	 * listar evento
	 * buscar por ID
	 * excluir evento*/
	 