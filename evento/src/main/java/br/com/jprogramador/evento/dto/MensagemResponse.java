package br.com.jprogramador.evento.dto;

/*Essa classe serve para transportar dados entre partes
 * do sistema. é usada para retornar mensagens em formato
 * json. 
 * Exemplo: {"mensagem": "evento removido com sucesso."}
 * */


public class MensagemResponse {
	
	private String mensagem;
	
	public MensagemResponse() {
		
	} 
	
	public MensagemResponse(String mensagem) {
		this.mensagem = mensagem;
	}
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}
}
