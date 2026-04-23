package br.com.jprogramador.evento.exception;

/*Exceção personalizada usada quando um recurso não é encontrado
 * neste projeto será usada quando um evento não existir no banco.
 * */

public class RecursoNaoEncontradoException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public RecursoNaoEncontradoException(String mensagem) {
		super(mensagem);
	}
	
}
