import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function DeleteContacts(){

    const router = useRouter()
    const { id } = router.query
    console.log(`id: ${id}`)

    const [inputValue, setInput] = useState({
        nome: '',
        email: '',
        rua: '',
        bairro: '',
        cidade: '',
        num: ''
    })

    const [objts, setObjts] = useState({
        dadosContato: undefined,
        statusContato: 'load',
        dadosTelefone: undefined,
        statusTelefone: 'load',
        dadosEndereco: undefined,
        statusEndereco: 'load'
    })

    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({placement, title, descricao}) => {
        api.info({
            message: `${title}`,
            description: `${descricao}`,
            placement,
        });
    }

    const [messageApi, contextHolder2] = message.useMessage();
    const key = 'updatable';

    const openMessage = () => {
        messageApi.open({
        key,
        type: 'loading',
        content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });
        }, 1000);
    };

    const formatData = () => {

        const registerData = {
            nome: document.getElementById('formGridName').value,
            endereco: document.getElementById('formGridAddress').value,
            idade: document.getElementById('formGridAge').value,
        };

        if(!registerData.nome){
            openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
        }
        else if(!registerData.endereco){
            openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
        }
        else if(!registerData.idade){
            openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
        }
        else{
            console.log('chama função de cadastrar')
            editaDados({objData: registerData})
        }
        //console.log(document.getElementById('formGridName').value)
        //console.log(document.getElementById('formGridAge').value)
        //console.log(document.getElementById('formGridAddress').value)
    }

    const carregaContato = async () => {
        console.log('entrou no contato')
        try {
            const response = await fetch(`http://127.0.0.1:8000/contatos/${id}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setObjts({
                    dadosContato: undefined,
                    statusContato: 'erro',
                    dadosTelefone: objts.dadosTelefone,
                    statusTelefone: objts.statusTelefone,
                    dadosEndereco: objts.dadosEndereco,
                    statusEndereco: objts.statusEndereco
                })
            }

            const data = await response.json();
            //console.log(data)
            
            setObjts({
                dadosContato: data,
                statusContato: 'ok',
                dadosTelefone: objts.dadosTelefone,
                statusTelefone: objts.statusTelefone,
                dadosEndereco: objts.dadosEndereco,
                statusEndereco: objts.statusEndereco
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setObjts({
                dadosContato: undefined,
                statusContato: 'erro',
                dadosTelefone: objts.dadosTelefone,
                statusTelefone: objts.statusTelefone,
                dadosEndereco: objts.dadosEndereco,
                statusEndereco: objts.statusEndereco
            })
        }
    }

    const carregaTelefone = async () => {
        console.log('entrou no Telefone')
        try {
            const response = await fetch(`http://127.0.0.1:8000/telefones/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setObjts({
                    dadosContato: objts.dadosContato,
                    statusContato: objts.statusContato,
                    dadosTelefone: undefined,
                    statusTelefone: 'erro',
                    dadosEndereco: objts.dadosEndereco,
                    statusEndereco: objts.statusEndereco
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.owner == id)
            //console.log(data)

            setObjts({
                dadosContato: objts.dadosContato,
                statusContato: objts.statusContato,
                dadosTelefone: filterData,
                statusTelefone: 'ok',
                dadosEndereco: objts.dadosEndereco,
                statusEndereco: objts.statusEndereco
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setObjts({
                dadosContato: objts.dadosContato,
                statusContato: objts.statusContato,
                dadosTelefone: undefined,
                statusTelefone: 'erro',
                dadosEndereco: objts.dadosEndereco,
                statusEndereco: objts.statusEndereco
            })
        }
    }

    const carregaEndereco = async () => {
        console.log('entrou no Endereco')
        try {
            const response = await fetch(`http://127.0.0.1:8000/enderecos/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setObjts({
                    dadosContato: objts.dadosContato,
                    statusContato: objts.statusContato,
                    dadosTelefone: objts.dadosTelefone,
                    statusTelefone: objts.statusTelefone,
                    dadosEndereco: undefined,
                    statusEndereco: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.contato == id)
            //console.log(data)
            
            setObjts({
                dadosContato: objts.dadosContato,
                statusContato: objts.statusContato,
                dadosTelefone: objts.dadosTelefone,
                statusTelefone: objts.statusTelefone,
                dadosEndereco: filterData,
                statusEndereco: 'ok'
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setObjts({
                dadosContato: objts.dadosContato,
                statusContato: objts.statusContato,
                dadosTelefone: objts.dadosTelefone,
                statusTelefone: objts.statusTelefone,
                dadosEndereco: undefined,
                statusEndereco: 'erro'
            })
        }
    }

    if(objts.dadosContato == undefined && objts.statusContato == 'load' && id != undefined){
        carregaContato()
    }
    if(objts.dadosTelefone == undefined && objts.statusTelefone == 'load' && id != undefined){
        carregaTelefone()
    }
    if(objts.dadosEndereco == undefined && objts.statusEndereco == 'load' && id != undefined){
        carregaEndereco()
    }

    const editaDados = async ({objData}) => {
        openMessage()
        fetch(contatoUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            openNotification({placement: 'topRight', title: 'Contato Editado', descricao: 'As Alterações foram feitas com Sucesso!'})
            setTimeout(function () {
                // Ação que será executada após o tempo específico
                router.back()
            }, 2000);
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const handleChangeName = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputText,
                email: inputValue.email,
                rua: inputValue.rua,
                bairro: inputValue.bairro,
                cidade: inputValue.cidade,
                num: inputValue.num
            })
        }
    }

    const handleChangeRoad = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputValue.nome,
                email: inputValue.email,
                rua: inputText,
                bairro: inputValue.bairro,
                cidade: inputValue.cidade,
                num: inputValue.num
            })
        }
    }

    const handleChangeReighborhood = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputValue.nome,
                email: inputValue.email,
                rua: inputValue.rua,
                bairro: inputText,
                cidade: inputValue.cidade,
                num: inputValue.num
            })
        }
    }

    const handleChangeCity = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputValue.nome,
                email: inputValue.email,
                rua: inputValue.rua,
                bairro: inputValue.bairro,
                cidade: inputText,
                num: inputValue.num
            })
        }
    }

    const handleChangeNumber = (e) => {
        const inputText = e.target.value

        if (/^[A-Z 0-9']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputValue.nome,
                email: inputValue.email,
                rua: inputValue.rua,
                bairro: inputValue.bairro,
                cidade: inputValue.cidade,
                num: inputText
            })
        }
    }

    const handleChangeEmail = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9 @ . ']+$/.test(inputText) || inputText === '') {
            setInput({
                nome: inputValue.nome,
                email: inputText,
                rua: inputValue.rua,
                bairro: inputValue.bairro,
                cidade: inputValue.cidade,
                num: inputValue.num
            })
        }
    }

    if(objts.statusContato == 'ok' && objts.statusTelefone == 'ok' && objts.statusEndereco == 'ok'){
        console.log('dados do contato:')
        console.log(objts.dadosContato)
        console.log('dados do telefone:')
        console.log(objts.dadosTelefone)
        console.log('dados do endereço:')
        console.log(objts.dadosEndereco)
    }

    return(
        <main className={styles.main}>
            {
                objts.statusContato == 'load' || objts.statusEndereco == 'load' || objts.statusTelefone == 'load'
                ?
                    <Load/>
                :
                objts.statusContato == 'erro' || objts.statusEndereco == 'erro' || objts.statusTelefone == 'erro'
                ?
                    <Error/>
                :
                <Forms
                    context01={contextHolder}
                    context02={contextHolder2}
                    changeName={handleChangeName}
                    changeEmail={handleChangeEmail}
                    changeRoad={handleChangeRoad}
                    changeReigh={handleChangeReighborhood}
                    changeCity={handleChangeCity}
                    changeNumber={handleChangeNumber}
                    nome={inputValue.nome}
                    email={inputValue.email}
                    rua={inputValue.rua}
                    bairro={inputValue.bairro}
                    cidade={inputValue.city}
                    num={inputValue.num}
                    func={formatData}
                />
            }
        </main>
    )
}
/*
<Forms
                        context01={contextHolder}
                        context02={contextHolder2}
                        changeName={handleChangeName}
                        changeAge={handleChangeAge}
                        changeAddress={handleChangeAddress}
                        nome={inputValue.nome}
                        idade={inputValue.idade}
                        endereco={inputValue.endereco}
                        func={formatData}
                    />
*/
function Forms({
        context01, 
        context02, 
        changeName, 
        changeEmail, 
        changeRoad,
        changeReigh,
        changeCity,
        changeNumber,
        nome, 
        email,
        rua,
        bairro,
        cidade,
        num,
        func
    }){
    return(
        <>
            {context01}
            {context02}
            <h1>Página de Criar Contatos</h1>
            <hr></hr>
            <Container>
                <Row>
                    <Col>
                        <h1>Contato</h1>
                        <Form>
                            <Form.Group controlId="formGridName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Fulano de Tal" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeName}
                                value={nome}
                            />
                            </Form.Group>
        
                            <Form.Group controlId="formGridEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="fulado@gmail.com" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeEmail}
                                value={email}
                            />
                            </Form.Group>
                        </Form>
                    </Col>

                    <Col>
                        <h1>Telefones</h1>
                        <div>
                            <div>Número 1: 998113464</div>
                            <div>Número 2: 998113363</div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <h1>Endereço</h1>
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Rio de Janeiro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeCity}
                                value={cidade}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridReigh">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Centro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeReigh}
                                value={bairro}
                            />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} controlId="formGridRoad">
                            <Form.Label>Rua</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="7 de Setembro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeRoad}
                                value={rua}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridNumber">
                            <Form.Label>Nº</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="10" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeNumber}
                                value={num}
                            />
                            </Form.Group>
                        </Row>
                    </Form>
                </Row>
            </Container>
        </>
    )
}

function Load(){
    return(
        <div className={styles.fade}>
            <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

function Error(){
    return(
        <h1>Error</h1>
    )
}

/*
return(
        <main className={styles.main}>
            {contextHolder}
            {contextHolder2}
            <h1>Página de Criar Contatos</h1>
            <hr></hr>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Fulano de Tal" 
                    required 
                    minLength="1" 
                    maxlength="250"
                    onChange={handleChangeName}
                    value={inputValue.nome}
                    />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridAge">
                    <Form.Label>Idade</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="18" 
                    required 
                    minLength="1" 
                    maxlength="3"
                    onChange={handleChangeAge}
                    value={inputValue.idade}
                    />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control 
                    placeholder="Rua da Água" 
                    required 
                    minLength="1" 
                    maxlength="250"
                    value={inputValue.endereco}
                    onChange={handleChangeAddress}
                    />
                </Form.Group>

                <Button variant="primary" onClick={formatData}>
                    Cadastrar
                </Button>
            </Form>
        </main>
    )
*/