package br.com.jprogramador.evento.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jprogramador.evento.dto.MensagemResponse;
import br.com.jprogramador.evento.entity.Evento;
import br.com.jprogramador.evento.service.EventoService;
import jakarta.validation.Valid;

/* Classe responsável por receber as requisições HTTP da API;
 * Aqui ficam os endpoints para cadastrar, listar, buscar, atualizar
 * e deletar eventos.
 * */


@RestController
@RequestMapping("/eventos")
@Validated
public class EventoController {

	private final EventoService eventoService;
	
	public EventoController(EventoService eventoService) {
		this.eventoService = eventoService;
	}
	
	/*Endpoint para cadastrar um novo evento
	 * Recebe os dados no corpo da requisição e retorna o evento salvo.
	 * */
	@PostMapping
	public ResponseEntity<Evento> criar(@Valid @RequestBody Evento evento){
		Evento eventoSalvo = eventoService.salvar(evento);
		return ResponseEntity.status(HttpStatus.CREATED).body(eventoSalvo);
	}
	
	// Endpoint para listar todos os eventos cadastrados
	@GetMapping
	public ResponseEntity<List<Evento>>listarTodos(){
		List<Evento> eventos = eventoService.listarTodos();
		return ResponseEntity.ok(eventos);
	}
	
	//Endpoint para buscar um evento pelo ID
	@GetMapping("/{id}")
	public ResponseEntity<Evento>buscarPorId(@PathVariable Long id){
		Evento evento = eventoService.buscarPorId(id);
		return ResponseEntity.ok(evento);
	}
	
	
	//EndPoint para atualizar um evento existente
	@PutMapping("/{id}")
	public ResponseEntity<Evento>atualizar(@PathVariable Long id, 
			@Valid @RequestBody Evento evento){
		Evento eventoAtualizado = eventoService.atualizar(id,evento);
		return ResponseEntity.ok(eventoAtualizado);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<MensagemResponse> deletar(@PathVariable Long id){
		eventoService.deletar(id);
		return ResponseEntity.ok(new MensagemResponse("Evento removido com sucesso"));
	}
}

