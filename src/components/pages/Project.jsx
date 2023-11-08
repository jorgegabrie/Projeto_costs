import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../services/ServiceForm'
import ServiceCard from '../services/ServiceCard'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project(){

    const {id} = useParams()
    

    const [services, setServices] = useState([])

    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()
    const [showServiceForm, setShowServiceForm] = useState(false)


    useEffect(()=>{
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`,{
                method:"GET",
                headers : {
                    'Content-type':'application/json'
                }
            }).then(resp => resp.json())
            .then((data)=> {
                setProject(data)
                setServices(data.services)
            })
            .catch(err=> console.log(err)) 
        }, 500);
    },[id])

    function editPost(project){
        setMessage('')
        // budget validation
        if(project.budget < project.costs) {
            setMessage("O orçamento não pode ser menor que o custo do projeto")
            setType('error')
            return false
        }
        fetch(`http://localhost:5000/projects/${id}`, {
            method :"PATCH",
            headers : {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(resp => resp.json())
        .then((data)=> {
            setProject(data)
            setShowProjectForm(false)
            setMessage("Projeto editado com sucesso")
            setType('success')

        })
        .catch()
    }

    function createService(project){
        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.costs

        const newCost = parseFloat(project.costs) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        project.costs = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method:'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data)=> {
            setShowServiceForm(false)
            setServices(data.services)
            
        })
        .catch(err => console.log(err))
    }

    function removeService(id, costs){
        const servicesUpdate = project.services.filter(
            (services) => services.id !== id
        )

        const projectsUpdate = project

        projectsUpdate.services = servicesUpdate

        projectsUpdate.costs = parseFloat(projectsUpdate.costs) - parseFloat(costs)

        fetch(`http://localhost:5000/projects/${projectsUpdate.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(projectsUpdate)
        }).then((resp) => resp.json())
        .then((data)=> {
            setProject(projectsUpdate)
            setServices(servicesUpdate)
            setMessage('Serviço removido com sucesso!')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    function toogleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toogleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }


    return (
        <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toogleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span>{project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total de Utilizado:</span> R${project.costs}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project}/>
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toogleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviço"
                                    projectData={project}
                                    />
                                )}
                            </div>
                    </div>
                    <h2>Serviços:</h2>
                    <Container customClass="start">
                        {services.length > 0 && 
                            services.map((services)=>(
                                <ServiceCard
                                    id={services.id}
                                    name={services.name}
                                    costs={services.costs}
                                    Description={services.Description}
                                    key={services.id}
                                    handleRemove={removeService}
                                />
                            ))
                        }
                        {services.length === 0 && <p>Não há serviços cadastrados</p>}
                    </Container>
                </Container>
            </div>
        )
         
        : (
        <Loading/>
        )}
        </>
    )
}

export default Project