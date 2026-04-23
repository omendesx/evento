package br.com.jprogramador.evento.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.jprogramador.evento.entity.Evento;
import br.com.jprogramador.evento.exception.RecursoNaoEncontradoException;
import br.com.jprogramador.evento.repository.EventoRepository;

/* classe responsável pelas regras de negócio do sistema
 * Ela fica entre o controller e o repository.
 * Aqui centralizamos as operações de salvar, listar, buscar
 * atualizar e deletar eventos*/

@Service
public class EventoService {
	private final EventoRepository eventoRepository;
	
	public EventoService(EventoRepository eventoRepository) {
		this.eventoRepository = eventoRepository;
	}
	
	// Salva um novo evento no banco de dados
	public Evento salvar(Evento evento) {
		return eventoRepository.save(evento);
	}
	
	// Retorna todos os eventos cadastrados
	public List<Evento>listarTodos(){
		return eventoRepository.findAll();
	}
	
	// Busca um evento pelo ID, se não encontrar lança uma exceção
	public Evento buscarPorId(Long id) {
		return eventoRepository.findById(id).orElseThrow(()-> new 
				RecursoNaoEncontradoException("Evento com id"+ id + 
						"não encontrado"));	
	}
	
	 // Atualiza um evento existente. Primeiro busca o evento no banco
	// depois altera os campos e salva novamente
	public Evento atualizar(Long id, Evento eventoAtualizado) {
		Evento eventoExistente = buscarPorId(id);
		
		eventoExistente.setNome(eventoAtualizado.getNome());
		eventoExistente.setLocal(eventoAtualizado.getLocal());
		eventoExistente.setData(eventoAtualizado.getData());
		eventoExistente.setDescricao(eventoAtualizado.getDescricao());
		
		return eventoRepository.save(eventoExistente);
		
	}
	
	// Remove um evento do banco de dados, se o id não existir a 
	// exceção será lançada
	public void deletar(Long id) {
		Evento eventoExistente = buscarPorId(id);
		eventoRepository.delete(eventoExistente);
	}
}
