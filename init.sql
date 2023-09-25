-- -- PostgreSQL Script
-- -- Modelo: Novo Modelo    Versão: 1.0

-- -- Crie o esquema 'unifit' no PostgreSQL
-- CREATE SCHEMA IF NOT EXISTS unifit;

-- -- Use o esquema 'unifit'
-- SET search_path TO unifit;

-- -- Tabela 'exercicio'
-- CREATE TABLE IF NOT EXISTS exercicio (
--   idexercicio SERIAL PRIMARY KEY,
--   nome VARCHAR(45) NOT NULL,
--   regiao_corporea VARCHAR(45),
--   dica VARCHAR(200),
--   imagepath VARCHAR(200)
-- );

-- -- Tabela 'treino'
-- CREATE TABLE IF NOT EXISTS treino (
--   idtreino SERIAL PRIMARY KEY,
--   nome VARCHAR(100) NOT NULL,
--   tipo VARCHAR(45),
--   created_at TIMESTAMP,
--   updated_at TIMESTAMP
-- );

-- -- Tabela 'aluno'
-- CREATE TABLE IF NOT EXISTS aluno (
--   idaluno SERIAL PRIMARY KEY,
--   matricula VARCHAR(13) NOT NULL UNIQUE,
--   nome VARCHAR(45),
--   curso VARCHAR(3) CHECK (curso IN ('SIN', 'CCO')),
--   nascimento DATE,
--   objetivo VARCHAR(45),
--   ano_ingresso INT,
--   etnia VARCHAR(45) CHECK (etnia IN ('Branco', 'Negro', 'Oriental', 'Hispania', 'Pardo')),
--   sexo VARCHAR(10) CHECK (sexo IN ('Masculino', 'Feminino')),
--   observacao VARCHAR(450),
--   email VARCHAR(100) UNIQUE,
--   senha VARCHAR(100),
--   UNIQUE (matricula)
-- );

-- -- Tabela 'anamnese'
-- CREATE TABLE IF NOT EXISTS anamnese (
--   idanamnese SERIAL PRIMARY KEY,
--   patologia VARCHAR(45),
--   medicamentos VARCHAR(45),
--   alergia VARCHAR(45),
--   dieta VARCHAR(45),
--   lesoes VARCHAR(45),
--   cirurgias VARCHAR(45),
--   tabagismo VARCHAR(45) CHECK (tabagismo IN ('Não', 'Diário', 'Semanal', 'Ocasional', 'Ocasional Raro')),
--   alcoolismo VARCHAR(45) CHECK (alcoolismo IN ('Não', 'Diário', 'Semanal', 'Ocasional', 'Ocasional Raro')),
--   hereditariedade VARCHAR(45),
--   esporte VARCHAR(45), 
--   stress SMALLINT,
--   ansiedade SMALLINT,
--   depressao SMALLINT,
--   acompanhamento_medico SMALLINT,
--   tratamento VARCHAR(500),
--   sintomas VARCHAR(500),
--   situacao_atual VARCHAR(500),
--   gatilhos VARCHAR(500),
--   aluno_idaluno INT REFERENCES aluno(idaluno)
-- );

-- -- Tabela 'avaliacao_fisica'
-- CREATE TABLE IF NOT EXISTS avaliacao_fisica (
--   idavaliacao_fisica SERIAL PRIMARY KEY,
--   peso REAL,
--   altura REAL,
--   torax REAL,
--   cintura REAL,
--   abdomen REAL,
--   braco_esquerdo REAL,
--   braco_direito REAL,
--   antebraco_esquerdo REAL,
--   antebraco_direito REAL,
--   coxa_direito REAL,
--   coxa_esquerdo REAL,
--   perna_direito REAL,
--   perna_esquerdo REAL,
--   sunescapular REAL,
--   toracica REAL,
--   abdominal REAL,
--   triceps REAL,
--   axilar REAL,
--   coxa REAL,
--   biceps REAL,
--   supra_iliaca REAL,
--   panturrilha REAL,
--   abdominal_resistencia VARCHAR(45),
--   aluno_idaluno INT REFERENCES aluno(idaluno)
-- );

-- -- Tabela 'treino_has_aluno'
-- CREATE TABLE IF NOT EXISTS treino_has_aluno (
--   treino_idtreino INT REFERENCES treino(idtreino),
--   aluno_idaluno INT REFERENCES aluno(idaluno),
--   observacoes VARCHAR(500),
--   PRIMARY KEY (treino_idtreino, aluno_idaluno)
-- );

-- -- Tabela 'professor'
-- CREATE TABLE IF NOT EXISTS professor (
--   idprofessor SERIAL PRIMARY KEY,
--   nome VARCHAR(45) NOT NULL,
--   email VARCHAR(45) NOT NULL UNIQUE,
--   nascimento DATE,
--   sexo VARCHAR(10) CHECK (sexo IN ('Masculino', 'Feminino')), 
--   senha VARCHAR(100) NOT NULL,
--   isestagiario boolean NOT NULL
-- );

-- -- Tabela 'tecnico_administrativo'
-- CREATE TABLE IF NOT EXISTS tecnico_administrativo (
--   idtecnico_administrativo SERIAL PRIMARY KEY,
--   nome VARCHAR(45),
--   sexo VARCHAR(10) CHECK (sexo IN ('Masculino', 'Feminino')), 
--   email VARCHAR(45) UNIQUE,
--   nascimento DATE,
--   senha VARCHAR(100)
-- );

-- -- Tabela 'servico'
-- CREATE TABLE IF NOT EXISTS servico (
--   idservico SERIAL PRIMARY KEY,
--   nome VARCHAR(45) NOT NULL,
--   observacao VARCHAR(500)
-- );

-- -- Tabela 'aluno_participa'
-- CREATE TABLE IF NOT EXISTS aluno_participa (
--   projeto_idservico INT REFERENCES servico(idservico),
--   aluno_idaluno INT REFERENCES aluno(idaluno),
--   PRIMARY KEY (projeto_idservico, aluno_idaluno)
-- );

-- -- Tabela 'frequencia'
-- CREATE TABLE IF NOT EXISTS frequencia (
--   idfrequencia SERIAL PRIMARY KEY,
--   data_hora timestamp;
--   aluno_participa_projeto_idservico INT NOT NULL,
--   aluno_participa_aluno_idaluno INT NOT NULL,
--   tecnico_administrativo_idtecnico_administrativo INT NOT NULL,
--   FOREIGN KEY (aluno_participa_projeto_idservico, aluno_participa_aluno_idaluno) REFERENCES aluno_participa(projeto_idservico, aluno_idaluno),
--   FOREIGN KEY (tecnico_administrativo_idtecnico_administrativo) REFERENCES tecnico_administrativo(idtecnico_administrativo)
-- );

-- -- Primeiro, remova as colunas de data e hora existentes
-- ALTER TABLE frequencia
-- DROP COLUMN IF EXISTS data,
-- DROP COLUMN IF EXISTS hora;

-- -- Em seguida, adicione uma coluna timestamp para data e hora
-- ALTER TABLE frequencia
-- ADD COLUMN data_hora timestamp;


-- -- Tabela 'professor_coordena'
-- CREATE TABLE IF NOT EXISTS professor_coordena (
--   professor_idprofessor INT REFERENCES professor(idprofessor),
--   projeto_idservico INT REFERENCES servico(idservico),
--   PRIMARY KEY (professor_idprofessor, projeto_idservico)
-- );

-- -- Tabela Exercicio_has_Treino
-- CREATE TABLE IF NOT EXISTS exercicio_has_treino (
--   exercicio_idexercicio INT NOT NULL,
--   treino_idtreino INT NOT NULL,
--   series INT NULL,
--   repeticoes INT NULL,
--   carga_maxima INT NULL,
--   PRIMARY KEY (exercicio_idexercicio, treino_idtreino),
--   CONSTRAINT fk_exercicio_has_treino_treino1
--     FOREIGN KEY (treino_idtreino)
--     REFERENCES treino (idtreino),
--   CONSTRAINT fk_exercicio_has_treino_exercicio1
--     FOREIGN KEY (exercicio_idexercicio)
--     REFERENCES exercicio (idexercicio)
-- );
 
-- ALTER TABLE unifit.anamnese
-- ALTER COLUMN stress TYPE VARCHAR(45),
-- ALTER COLUMN ansiedade TYPE VARCHAR(45),
-- ALTER COLUMN depressao TYPE VARCHAR(45),
-- ALTER COLUMN acompanhamento_medico TYPE VARCHAR(45);


-- -- Crie uma função que define a data e hora automaticamente
-- CREATE OR REPLACE FUNCTION set_data_hora_frequencia()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.data_hora = NOW(); -- Define a data e hora atuais
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Crie um gatilho que chama a função acima antes da inserção
-- CREATE TRIGGER before_insert_frequencia
-- BEFORE INSERT ON frequencia
-- FOR EACH ROW
-- EXECUTE FUNCTION set_data_hora_frequencia();
 
-- INSERT INTO unifit.tecnico_administrativo (nome, sexo, email, nascimento, senha)
-- VALUES ('TA','Masculino', 'TA@unifit.com', '01/01/2000',  '$2b$10$i.JG5jWKfVBw2EmHzRxoReKTX3zkP2RZhOOkkDLFt8/3Iw0EXT9JK');
 

-- INSERT INTO unifit.aluno (matricula, nome, curso, nascimento, ano_ingresso, etnia, email, senha) 
-- VALUES ('2020005750', 'Gustavo Henrique Salles', 'SIN', '09/10/1997', '2020', 'Branco', 'salles@unifei.edu.br', '$2b$10$i.JG5jWKfVBw2EmHzRxoReKTX3zkP2RZhOOkkDLFt8/3Iw0EXT9JK')

-- INSERT INTO unifit.servico (nome) Values ('Musculação');

-- INSERT INTO unifit.aluno_participa VALUES (1,1);