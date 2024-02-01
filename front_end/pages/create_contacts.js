import React from "react";
import styles from '../styles/create_contacts.module.css'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function DeleteContacts(){

    const apiUrl = 'http://127.0.0.1:8000/clientes/'

    var dadosParaCadastrar = {
        nome: 'sonia',
        endereco: 'Rua do açude 2',
        idade: '20',
        // Adicione mais campos conforme necessário
    };

    const formatData = () => {
        if(!document.getElementById('formGridName').value){
            console.log('campo em branco')
        }
        //console.log(document.getElementById('formGridName').value)
        console.log(document.getElementById('formGridAge').value)
        console.log(document.getElementById('formGridAddress').value)
    }

    const cadastrarDados = async () => {
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Adicione outros cabeçalhos, como tokens de autenticação, se necessário
          },
          body: JSON.stringify(dadosParaCadastrar),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Dados cadastrados com sucesso:', data);
          })
          .catch(error => {
            console.error('Erro durante a requisição POST:', error);
          });
    }

    return(
        <main className={styles.main}>
            <h1>Página de Criar Contatos</h1>
            <hr></hr>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" placeholder="Fulano de Tal" required minLength="1" maxlength="250" />
                    </Form.Group>
    
                    <Form.Group as={Col} controlId="formGridAge">
                    <Form.Label>Idade</Form.Label>
                    <Form.Control type="text" placeholder="18" required minLength="1" maxlength="3"/>
                    </Form.Group>
                </Row>
    
                <Form.Group className="mb-3" controlId="formGridAddress">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control placeholder="Rua da Água, 311" required minLength="1" maxlength="250"/>
                </Form.Group>
    
                <Button variant="primary" onClick={formatData}>
                    Cadastrar
                </Button>
            </Form>
        </main>
    )
}