import pkg from 'mongoose';
const { Schema, model } = pkg;

const ContractDSchema = new Schema(
    {
        belongsTo: {type: String, required: true, unique: true, trim:true },
        goal: { type: String, required: true, trim: true, default: 'Contratar Gente' },
        description:{ type: String, required: true, trim: true, default: 'Contratacion de empleados mediante ofertas de puestos de trabajo' },
        _activities:{
            gestionarCuenta:{ //Actividad de gestionar cuenta
                id:{ type: String, required: true, trim: true, default: '001'},
                definition:{ type: String, required: true, trim: true, default: 'Gestionar Cuenta'},
                description:{ type: String, required: true, trim: true, default: 'Las entidades involucradas pueden gestionar sus cuentas'},
                _actions:{
                    Alta:{
                        id:{ type: String, required: true, trim: true, default: '0011'},
                        definition:{ type: String, required: true, trim: true, default: 'Alta'},
                        events:{
                            userRegistered:{ type: String},
                        }
                    },
                    Baja:{ //Baja
                        id:{ type: String, required: true, trim: true, default: '0012'},
                        definition:{ type: String, required: true, trim: true, default: 'Baja'},
                        events:{
                            userDeleted: { type: String},
                            logouts:[String],
                        }
                    },                        
                }
            },
            ofertarEmpleo:{ //Ofertar Empleo
                id:{ type: String, required: true, trim: true, default: '002' },
                definition:{ type: String, required: true, trim: true, default: 'Ofrecer Empleo'},
                description:{ type: String, required: true, trim: true, default: 'La empresa puede subir una oferta de empleo'},
                _actions:{
                    registrarEmpresa:{ //Registrar empresa
                        id:{ type: String, required: true, trim: true, default: '0021'},
                        definition:{ type: String, required: true, trim: true, default: 'Registrar empresa'},
                        events:{
                            companyRegister: { type: String},
                        }
                    },
                    habilitarOferta:{ //Habilitar oferta
                        id:{ type: String, required: true, trim: true, default: '0022'},
                        definition:{ type: String, required: true, trim: true, default: 'Habilitar Oferta'},
                        events:{
                            offerSubmitted:[String],
                        }
                    },
                    detallesOferta:{ //Publicar oferta
                        id:{ type: String, required: true, trim: true, default: '0023'},
                        definition:{ type: String, required: true, trim: true, default: 'Publicar Oferta'},
                        events:{
                            offerDetails:[{
                                id: String, 
                                title: String, 
                                description: String,
                                user: String,
                                date: String,
                            }],
                        }
                    },                       
                }
            },
            aplicacion:{ //Aplicacion de usuarios
                id:{ type: String, required: true, trim: true, default: '003'},
                definition:{ type: String, required: true, trim: true, default: 'Aplicacion'},
                description:{ type: String, required: true, trim: true, default: 'Los usuarios pueden aplicar a las ofertas de trabajo'},
                _actions:{
                    registrarDemandante:{ //Registrar demandante
                        id:{ type: String, required: true, trim: true, default: '0031'},
                        definition:{ type: String, required: true, trim: true, default: 'Registrar demandante'},
                        events:{
                            candidateRegister:{ type: String},
                        }
                    },
                    // mostrarInteres:{ //Mostrar interés en oferta
                    //     id:{ type: String, required: true, trim: true, default: '0032'},
                    //     definition:{ type: String, required: true, trim: true, default: 'Mostrar Interés'},
                    //     events:{}
                    // },
                    datosPersonales:{ //Datos Personales
                        id:{ type: String, required: true, trim: true, default: '0033'},
                        definition:{ type: String, required: true, trim: true, default: 'Datos personales registrados'},
                        events:{
                            datos:[{
                                offer: String,
                                name: String,
                                email: String,
                                address: String,
                                date: String,
                                idUser: String,
                            }],
                        }
                    },  
                    aplicar:{ //Aplicar
                        id:{ type: String, required: true, trim: true, default: '0034'},
                        definition:{ type: String, required: true, trim: true, default: 'Aplicar'},
                        events:{
                            applicationSubmitted:[String],
                        }
                    },                     
                }
            },
            entrevistar:{ // Entrevistar
                id:{ type: String, required: true, trim: true, default: '004'},
                definition:{ type: String, required: true, trim: true, default: 'Entrevistar'},
                description:{ type: String, required: true, trim: true, default: 'La empresa tiene que poder realizar entrevistas para contratar candidatos'},
                _actions:{
                    seleccionarCandidatos:{ //Seleccionar Candidatos
                        id:{ type: String, required: true, trim: true, default: '0041'},
                        definition:{ type: String, required: true, trim: true, default: 'Seleccionar candidatos'},
                        events:{
                            applicantsSelected:[String],
                        }
                    },
                    terminos:{ //definir terminos de la entrevista
                        id:{ type: String, required: true, trim: true, default: '0042'},
                        definition:{ type: String, required: true, trim: true, default: 'Definir terminos de la entrevista'},
                        events:{
                            interviewTerms:[String],
                        }
                    }, 
                }
            },
            contratacion:{ //Contratacion 
                id:{ type: String, required: true, trim: true, default: '005'},
                definition:{ type: String, required: true, trim: true, default: 'Contratacion'},
                description:{ type: String, required: true, trim: true, default: 'La empresa tiene que poder ofrecer un contrato a los candidatos seleccionados tras el proceso de entrevistas'},
                _actions:{
                    ofertarContrato:{ //ofertar contrato
                        id:{ type: String, required: true, trim: true, default: '0051'},
                        definition:{ type: String, required: true, trim: true, default: 'Ofertar contrato'},
                        events:{
                            contractsOffered:[String],
                        }
                    },
                    detallesContrato:{ //contraofertar 
                        id:{ type: String, required: true, trim: true, default: '0052'},
                        definition:{ type: String, required: true, trim: true, default: 'Contraofertar contrato'},
                        events:{
                            details:[{
                                job: String,
                                employee: String,
                                employer: String,
                                salary: String,
                                startDate: String,
                                duration: String,
                                typeOfContract: String,
                                activity: String,
                                timetable: String,
                                extraInfo: String,
                            }],
                        }
                    },
                    resolucionFinal:{ //resolucion
                        id:{ type: String, required: true, trim: true, default: '0053'},
                        definition:{ type: String, required: true, trim: true, default: 'Resolucion'},
                        events:{
                            resolution:[String],
                        }
                    }, 
                }

            },
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


export default model("ContractD", ContractDSchema);


