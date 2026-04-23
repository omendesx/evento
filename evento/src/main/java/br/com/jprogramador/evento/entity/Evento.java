package br.com.jprogramador.evento.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "eventos")
public class Evento {
	
	
	/*Essa classe representa o objeto evento no java
	 * a tabela eventos no banco de dados ou seja, cada 
	 * objeto evento será uma linha na tabela
	 * @Entity
	 * Diz que a classe será uma entidade do JPA
	 * @Table= define que o nome da tabela sera eventos
	 * @Id = marca o campo id como chave primária
	 * @GeneratedValue = faz o id ser gerado automaticamente
	 * pelo banco
	 * @Column = configura a coluna da tabela
	 * @NotBlank = não permite texto vazio
	 * @NotNull = não permite valor nulo
	 * @Size = Limita a quantidade de caracteres
	 * @FutureOrPresent = a data deve ser hoje ou futura
	 * */
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "O nome do evento é obrigatório")
	@Size(max = 100, message = "O nome do evento deve ter no máximo 100 caracteres.")
	@Column(name = "nome", nullable = false, length = 100)
	private String nome;
	
	@NotNull(message = "O local do evento é obrigatório")
	@Size(max = 100, message = "O local do evento deve ter no máximo 100 caracteres")
	@Column(name = "local", nullable = false)
	private String local;
	
	@NotNull(message = "A data do evento é obrigatória.")
	@FutureOrPresent(message = "A data do evento deve ser hoje ou futura.")
	@Column(name = "data", nullable = false)
	private LocalDate data;
	
	@NotBlank(message = "A descrição do evento é obrigatória.")
	@Size(max = 255, message = "A descrição do evento deve ser no máximo 255 caracteres.")
	@Column(name = "descrição", nullable = false, length = 255)
	private String descricao;
	
	public Evento() {
		
	}
	
	public Evento(Long id, String nome, String local, LocalDate data, String descricao) {
		this.id = id;
		this.nome = nome;
		this.local = local;
		this.data = data;
		this.descricao = descricao;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getLocal() {
		return local;
	}

	public void setLocal(String local) {
		this.local = local;
	}

	public LocalDate getData() {
		return data;
	}

	public void setData(LocalDate data) {
		this.data = data;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	
	
}
