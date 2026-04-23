package br.com.jprogramador.evento.exception;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/*Classe responsável por tratar os erros da aplicação de forma global.
 * Assim a API devolve respostas organizadas em Json quando acontece 
 * algum problema.
 * */

@RestControllerAdvice
public class GlobalExceptionHandler  {
	
	/*Trata o caso em que um evento não é encontrado.
	 * Retorna erro 404
	 * */
	
	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity <Map<String, Object>> tratarRecursoNaoEncontrado(
			RecursoNaoEncontradoException ex){
		Map<String, Object> erro = new HashMap<>();
		erro.put("dataHora", LocalDateTime.now());
		erro.put("status", HttpStatus.NOT_FOUND.value());
		erro.put("erro", "Recurso não encontrado");
		erro.put("mensagem", ex.getMessage());
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
		
	}
	
	/*Trata erros de validação em objetos enviados no corpo da requisição
	 * Exemplo: @Valid @RequestBody Evento evento*/
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> tratarMethodArgumentNotValid(
			MethodArgumentNotValidException ex){
		Map<String, String> camposComErro = new HashMap<>();
		
		for(FieldError erro : ex.getBindingResult().getFieldErrors()) {
			camposComErro.put(erro.getField(), erro.getDefaultMessage());
		}
		
		
		Map<String, Object> resposta = new HashMap<>();
		resposta.put("dataHora", LocalDateTime.now());
		resposta.put("status", HttpStatus.BAD_REQUEST.value());
		resposta.put("erro", "Erro de validação");
		resposta.put("mensagens", camposComErro);
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
		
	}
	
	/* Trata erros de binding/validação em outros cenarios*/
	
		@ExceptionHandler(BindException.class)
		public ResponseEntity<Map<String, Object>> tratarBindException(BindException ex){
			Map<String, String> camposComErro = new HashMap<>();
			
			for(FieldError erro : ex.getBindingResult().getFieldErrors()) {
				camposComErro.put(erro.getField(),erro.getDefaultMessage());
			}
			
			Map<String, Object> resposta = new HashMap<>();
			resposta.put("dataHora", LocalDateTime.now());
			resposta.put("status", HttpStatus.BAD_REQUEST.value());
			resposta.put("erro", "Erro de validação");
			resposta.put("mensagens", camposComErro);
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
			
		}
		
				/* Trata qualquer erro genérico não previsto.
				 * retorna erro 500*/
		
			@ExceptionHandler(Exception.class)
			public ResponseEntity<Map<String, Object>>tratarErroGenerico(Exception ex){
				Map<String, Object>erro = new HashMap<>();
				erro.put("dataHora", LocalDateTime.now());
				erro.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
				erro.put("erro", "Erro interno do servidor");
				erro.put("mensagem", ex.getMessage());
				
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
				
			}
	
}
