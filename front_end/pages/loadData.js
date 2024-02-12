import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/loadData.module.css'

export default function LoadData(){

    const router = useRouter()
    const { id } = router.query
    console.log(`id: ${id}`)

    const [objts, setObjts] = useState({
        dadosContato: undefined,
        statusContato: 'load',
        dadosTelefone: undefined,
        statusTelefone: 'load',
        dadosEndereco: undefined,
        statusEndereco: 'load'
    })

    const navPagDetails = ({idContato, dadosObjcs}) => {
        console.log(dadosObjcs)
        router.push({
            pathname: './edit_contacts',
            query: {id: idContato, dados: dadosObjcs.dadosContato.nome}
        })
    }

    const carregaContato = async () => {
        //console.log('entrou no contato')
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
        //console.log('entrou no Telefone')
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
        //console.log('entrou no Endereco')
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

    if(objts.statusContato == 'ok' && objts.statusTelefone == 'ok' && objts.statusEndereco == 'ok'){
        /*
        console.log('dados do contato:')
        console.log(objts.dadosContato)
        console.log('dados do telefone:')
        console.log(objts.dadosTelefone)
        console.log('dados do endereço:')
        console.log(objts.dadosEndereco)*/

        navPagDetails({idContato: id, dadosObjcs: objts})
    }

    return(
        <Load/>
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