import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import HMenu from './HMenu'
import { Link } from 'react-router-dom'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import { toast } from 'react-toastify'

const Config = () => {
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
  const [user, setUser] = useState('');
  const [hairdressers, setHairdressers] = useState([]);
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState([]);
  const [workDays, setWorkDays] = useState([]);
  const workDaysByHairdresserWorkDay = []
  const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const selectPartnerNonPartner = ['No socio','Socio'];
  
  const [inputAddHairdresser, setInputAddHairdresser] = useState('');
  const [inputTitleService, setInputTitleService] = useState('');
  const [inputValueService, setInputValueService] = useState('');
  const [selectCategoryService, setSelectCategoryService] = useState('');
  const [inputMembershipFee, serInputMembershipFee] = useState('');

  const [selectHairdressersWeekDays, setSelectHairdressersWeekDays] = useState('');
  const [selectDaysWeekDays, setSelectDaysWeekDays] = useState('');
  const [selectScheduleWeekDays, setSelectScheduleWeekDays] = useState('');
  const [inputCreateWeekDayH, setInputCreateWeekDayH] = useState('');
  const [inputCreateWeekDayM, setInputCreateWeekDayM] = useState('');
  const [inputCreateWeekDayOpen, setInputCreateWeekDayOpen] = useState(false);

  const [inputAddTitleVariouPrice, setInputAddTitleVariouPrice] = useState('');
  const [inputAddValueVariouPrice, setInputAddValueVariouPrice] = useState('');
  
  const [updateServiceBtnIsOpen, setUpdateServiceBtnIsOpen] = useState(false);
  const [updateInputMembershipFeeIsOpen, setUpdateInputMembershipFeeIsOpen] = useState(false);

  const [updateVariousPriceModal, setUpdateVariousPriceModal] = useState(false);

  const [showWorkDaysList, setShowWorkDaysList] = useState(false);

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => item.hairdresser == selectHairdressersWeekDays && item.work_day == selectDaysWeekDays)
    workDaysByHairdresserWorkDayFiltered.sort((a, b) => {
        const timeA = a.schedule.split(':').map(Number);
        const timeB = b.schedule.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
    
        return totalMinutesA - totalMinutesB;
    });
  
  const nonPartnersService = services.filter(service => service.category == 'No socio')
  const partnersService = services.filter(service => service.category == 'Socio')
  
  const hairdressersOptionsSelect = ['Peluquero'];
  const hairdressersName = hairdressers.map(hairdresser => hairdresser.name)
  hairdressersName.forEach(item => {
    hairdressersOptionsSelect.push(item)
  })
  const weekDays = ['Día laboral','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo',]
  const schedulesWeekDays = [];

  const palabrasABuscar = ["cuota", "socio"];
  const membershipFee = prices.find(objeto => 
    palabrasABuscar.every(palabra => 
      objeto.title.toLowerCase().includes(palabra.toLowerCase())
    )
  );

  const pricesWithoutMembershipFee = prices.filter(price => price.title.toLowerCase() != 'cuota socio')

  workDaysByHairdresserWorkDayFiltered.forEach(item => {
    workDaysByHairdresserWorkDay.push(`${item.schedule}`)
    schedulesWeekDays.push(`${item.schedule}`)
  }) 

  const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchHairdressersData() {
                const response = await fetch(`${apiUrl}/api/hairdressers`)
                const hairdressersAll = await response.json();
                setHairdressers(hairdressersAll.data)
            }
            fetchHairdressersData();
            async function fetchServicesData() {
                const response = await fetch(`${apiUrl}/api/services`)
                const servicesAll = await response.json();
                setServices(servicesAll.data)
            }
            fetchServicesData();
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                setPrices(pricesAll.data)
            }
            fetchPricesData();
            async function fetchWorkDaysData() {
                const response = await fetch(`${apiUrl}/api/workDays`)
                const workDaysAll = await response.json();
                setWorkDays(workDaysAll.data)
            }
            fetchWorkDaysData();
            const getCookie = (name) => {
            const cookieName = name + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i];
                while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
                }
                if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
                }
            }
            return "";
            };
            const cookieValue = getCookie('TokenJWT');
            const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
                const data = await response.json();
                if(data.error === 'jwt expired') {
                logout();
                window.location.href = '/login';
                } else {
                const user = data.data
                if(user) {
                    setUser(user)
                }
                }
            } catch (error) {
                console.error('Error:', error);
            }
            };
            fetchData();
            if(cookieValue) {
            login()
            } else {
            logout()
            }
        }, 60000);

        return () => clearInterval(interval); 
        
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchHairdressersData() {
            const response = await fetch(`${apiUrl}/api/hairdressers`)
            const hairdressersAll = await response.json();
            setHairdressers(hairdressersAll.data)
        }
        fetchHairdressersData();
        async function fetchServicesData() {
            const response = await fetch(`${apiUrl}/api/services`)
            const servicesAll = await response.json();
            setServices(servicesAll.data)
        }
        fetchServicesData();
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/prices`)
            const pricesAll = await response.json();
            setPrices(pricesAll.data)
        }
        fetchPricesData();
        async function fetchWorkDaysData() {
            const response = await fetch(`${apiUrl}/api/workDays`)
            const workDaysAll = await response.json();
            setWorkDays(workDaysAll.data)
        }
        fetchWorkDaysData();
        const getCookie = (name) => {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
        };
        const cookieValue = getCookie('TokenJWT');
        const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
            const data = await response.json();
            if(data.error === 'jwt expired') {
            logout();
            window.location.href = '/login';
            } else {
            const user = data.data
            if(user) {
                setUser(user)
            }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        };
        fetchData();
        if(cookieValue) {
        login()
        } else {
        logout()
        }
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    }, []);

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
        return regex.test(str);
    }

    const cleanText = (text) => {
        const replacements = {
          'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
          'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
          'ñ': 'n', 'Ñ': 'N'
        };
      
        return text.split('').map(char => replacements[char] || char).join('');
    };

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const handleInputAddHairdresser = (e) => {
      const texto = e.target.value;
      if(regexOnlyLetters(texto)) {
        const textToSaved = cleanText(texto);
        setInputAddHairdresser(textToSaved)
      }
    }

    const handleInputTitleService = (e) => {
      const texto = e.target.value;
      if(regexOnlyLetters(texto)) {
        const textToSaved = cleanText(texto);
        setInputTitleService(textToSaved)
      }
    }

    const handleInputValueService = (e) => {
      const texto = e.target.value;
      const textToSaved = cleanText(texto);
      setInputValueService(textToSaved)
    }

    const handleSelectCategoryService = (e) => {
        setSelectCategoryService(e)
    }

    const handleInputMembershipFee = (e) => {
      const texto = e.target.value;
      serInputMembershipFee(texto)
    }

    const handleInputAddTitleVariouPrice = (e) => {
      const texto = e.target.value;
      setInputAddTitleVariouPrice(texto)
    }

    const handleInputAddValueVariouPrice = (e) => {
      const texto = e.target.value;
      setInputAddValueVariouPrice(texto)
    }

    const handleSelectHairdressersWeekDays = (e) => {
      setSelectHairdressersWeekDays(e)
    }

    const handleSelectDaysWeekDays = (e) => {
      setSelectDaysWeekDays(e)
    }

    const handleSelectScheduleWeekDays = (e) => {
      setSelectScheduleWeekDays(e)
    }


    const handleInputCreateWeekDayH = (e) => {
      const texto = e.target.value;
      const regex = /^(0?[0-9]|1[0-9]|2[0-3])$/;
      if (texto === '' || regex.test(texto)) {
        setInputCreateWeekDayH(texto)
      }
    }

    const handleInputCreateWeekDayM = (e) => {
      const texto = e.target.value;
      const regex = /^(0?[0-9]|[1-5][0-9])$/;
      if (texto === '' || regex.test(texto)) {
        setInputCreateWeekDayM(texto)
      }
    }

    const handleOnBlurInputCreateWeekDayH = (e) => {
      const texto = e.target.value;
      if(texto.length == 1) {
        setInputCreateWeekDayH(`0${texto}`)
      }
    }

    const handleOnBlurInputCreateWeekDayM = (e) => {
      const texto = e.target.value;
      if(texto.length == 1) {
        setInputCreateWeekDayM(`0${texto}`)
      }
    }

    const handleBtnAddHairdresser = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const hairdresser_datetime = currentDate;

      if(inputAddHairdresser == '') {
        toast('Debes ingresar un peluquero', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const response = await fetch(`${apiUrl}/api/hairdressers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name: cleanString(inputAddHairdresser), hairdresser_datetime })
        })
        const data = await response.json();
        if (response.ok) {
            toast('Has agregado un peluquero a la lista', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } 
        if(data.error === 'There is already a hairdresser with that name') {
            toast('Ya existe un peluquero con ese nombre!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
      }
      
    }  

    const handleBtnDeleteHairdresser = async(id) => {
      
      const response = await fetch(`${apiUrl}/api/hairdressers/${id}`, {
          method: 'DELETE'
      })
      if (response.ok) {
          toast('Has eliminado el peluquero correctamente', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
          });
      } 

    }

    const hanldeBtnAddService = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const service_datetime = currentDate;

      if(inputTitleService == '' || inputValueService == '') {
        toast('Debes completar todos los campos!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const obj = {
          title: cleanString(inputTitleService),
          value: inputValueService,
          category: selectCategoryService?selectCategoryService:selectPartnerNonPartner[0],
          service_datetime: service_datetime
        }
        const response = await fetch(`${apiUrl}/api/services/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        if (response.ok) {
            toast('Has agregado un servicio a la lista', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } 
        if(data.error === 'There is already a service with that title') {
            toast('Ya existe un servicio con ese nombre y categoría!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
      }
      
    } 

    const [idService,setIdService] = useState('')
    const [titleService,setTitleService] = useState('')
    const [valueService,setValueService] = useState('')
    
    const handleBtnOpenUpdateService = (id,title,value) => {
      setIdService(id)
      setTitleService(title)
      setValueService(value)
      setUpdateServiceBtnIsOpen(true)
    }

    const handleBtnDeleteService = async(id) => {
      
      const response = await fetch(`${apiUrl}/api/services/${id}`, {
          method: 'DELETE'
      })
      if (response.ok) {
          toast('Has eliminado el servicio correctamente', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
          });
      } 

    }

    const handleBtnSaveMembershipFee = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const price_datetime = currentDate;

      if(inputMembershipFee == '') {
        toast('Debes ingresar el valor de la cuota de socio!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const obj = {
          title: 'Cuota socio',
          value: inputMembershipFee,
          price_datetime: price_datetime
        }
        const response = await fetch(`${apiUrl}/api/prices/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
          toast('Has guardado la cuota de socio correctamente', {
            position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } 
      }
      
    }       

    const handleEditMembershipFee = () => {
      setUpdateInputMembershipFeeIsOpen(true);
      serInputMembershipFee(membershipFee.value)
    }

    const [idVariousPrice,setIdVariousPrice] = useState('')
    const [titleVariousPrice,setTitleVariousPrice] = useState('')
    const [valueVariousPrice,setValueVariousPrice] = useState('')

    const handleBtnOpenUpdateVariousPrice = (id,title,value) => {
      setIdVariousPrice(id)
      setTitleVariousPrice(title)
      setValueVariousPrice(value)
      setUpdateVariousPriceModal(true)
    }

    const handleBtnDeleteVariouPrice = async(id, title) => {
      const response = await fetch(`${apiUrl}/api/prices/${id}`, {
          method: 'DELETE'
      })
      if (response.ok) {
          toast(`Has eliminado el precio de ${title} correctamente`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
          });
      } 
    }

    const handleBtnAddVariouPrice = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const price_datetime = currentDate;

      if(inputAddTitleVariouPrice == '' || inputAddValueVariouPrice == '') {
        toast('Debes completar todos los campos!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        } else {
          const obj = {
            title: inputAddTitleVariouPrice,
            value: inputAddValueVariouPrice,
            price_datetime: price_datetime
          }
          const response = await fetch(`${apiUrl}/api/prices/register`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify(obj)
          })
          if (response.ok) {
            toast(`Has añadido el precio de ${inputAddTitleVariouPrice} correctamente`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
          } 
        }
    }

    const handleBtnCreateWeekDay = async() => {
      if(selectHairdressersWeekDays == '' || selectHairdressersWeekDays == 'Peluquero') {
        toast('Debes seleccionar un peluquero!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(selectDaysWeekDays == '' || selectDaysWeekDays == 'Día laboral') {
        toast('Debes seleccionar un día!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(inputCreateWeekDayH == '' || inputCreateWeekDayM == '') {
        toast('Debes ingresar el horario!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const workDay_datetime = currentDate;
        const concatSchedulesWorkDays = inputCreateWeekDayH + ':' + inputCreateWeekDayM
        const obj = {
          hairdresser: selectHairdressersWeekDays,
          work_day: selectDaysWeekDays,
          schedule: concatSchedulesWorkDays,
          workDay_datetime: workDay_datetime
        }
        const response = await fetch(`${apiUrl}/api/workDays/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        if (response.ok) {
            toast(`Has guardado correctamente el horario ${concatSchedulesWorkDays} el día ${selectDaysWeekDays} del peluquero ${selectHairdressersWeekDays}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } 
        if(data.error === 'There is already a workDay with that data') {
            toast('El peluquero, día y horario ya existen!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
      }



    }       

    const handleBtnUpdateMembershipFee = async(id) => {

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const price_datetime = currentDate;

      if(inputMembershipFee == '') {
        toast('Debes ingresar el valor de la cuota de socio!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const obj = {
          title: 'Cuota socio',
          value: inputMembershipFee,
          price_datetime: price_datetime
        }
        const response = await fetch(`${apiUrl}/api/prices/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
            toast('Has actualizado la cuota de socio correctamente', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setUpdateInputMembershipFeeIsOpen(false)
        } 
      }
      
    }            

    
    const handleBtnDeleteScheduleWorkDay = async(id) => {
        const response = await fetch(`${apiUrl}/api/workDays/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            toast('Has eliminado el horario correctamente', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } 
    }

    
    const UpdateServiceModal = ({setUpdateServiceBtnIsOpen,id,title,value}) => {

      const [inputTitleUpdateService,setInputTitleUpdateService] = useState('')
      const [inputValueUpdateService,setInputValueUpdateService] = useState('')

      const handleBtnCloseModal = () => {
        setUpdateServiceBtnIsOpen(false)
      }

      const handleBtnUpdateServiceValue = async() => {
        if((inputTitleUpdateService == '' || inputTitleUpdateService == title) && (inputValueUpdateService == '' || inputValueUpdateService == value)) {
          toast('No tienes cambios para actualizar!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          const obj = {
            title: inputTitleUpdateService?inputTitleUpdateService:title,
            value: inputValueUpdateService?inputValueUpdateService:value,
          }
          const response = await fetch(`${apiUrl}/api/services/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify(obj)
          })
          if (response.ok) {
              toast('Has actualizado el servicio correctamente', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
              setUpdateServiceBtnIsOpen(false)
          } 
          const data = await response.json();
          if(data.error === 'There is already a service with that title') {
              toast('Ya existe un servicio con ese nombre y categoría!', {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
          }
        }
      }

      const handleInputTitleUpdateService = (e) => {
        const texto = e.target.value;
        setInputTitleUpdateService(texto)
      }

      const handleInputValueUpdateService = (e) => {
        const texto = e.target.value;
        setInputValueUpdateService(texto)
      }


      return (
        <div className='updateServiceModal'>
            <div className='updateServiceModal__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='updateServiceModal__btnCloseModal__prop'>X</div>
            </div>
            <div className='updateServiceModal__data'>
                <div className='updateServiceModal__data__label-input'>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputTitleUpdateService?inputTitleUpdateService:title} onChange={handleInputTitleUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputValueUpdateService?inputValueUpdateService:value} onChange={handleInputValueUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='updateServiceModal__btn'>
                <button onClick={handleBtnUpdateServiceValue} className='updateServiceModal__btn__prop'>Guardar</button>
            </div>
        </div>
        
      )
    }

    const UpdateVariousPriceModal = ({setUpdateVariousPriceModal,id,title,value}) => {

      const [inputUpdateTitleVariousPrice,setInputUpdateTitleVariousPrice] = useState('')
      const [inputUpdateValueVariousPrice,setInputUpdateValueVariousPrice] = useState('')

      const handleBtnCloseModal = () => {
        setUpdateVariousPriceModal(false)
      }

      const handleBtnUpdateServiceValue = async() => {
        if((inputUpdateTitleVariousPrice == '' || inputUpdateTitleVariousPrice == title) && (inputUpdateValueVariousPrice == '' || inputUpdateValueVariousPrice == value)) {
          toast('No tienes cambios para actualizar!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          const obj = {
            title: inputUpdateTitleVariousPrice?inputUpdateTitleVariousPrice:title,
            value: inputUpdateValueVariousPrice?inputUpdateValueVariousPrice:value,
          }
          const response = await fetch(`${apiUrl}/api/prices/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify(obj)
          })
          if (response.ok) {
              toast(`Has actualizado el precio de ${title} correctamente`, {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
              setUpdateVariousPriceModal(false)
          } 
          const data = await response.json();
          if(data.error === 'There is already a price with that title') {
              toast('Ya existe un precio con ese nombre!', {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
          }
        }
      }

      const handleInputTitleUpdateService = (e) => {
        const texto = e.target.value;
        setInputUpdateTitleVariousPrice(texto)
      }

      const handleInputValueUpdateService = (e) => {
        const texto = e.target.value;
        setInputUpdateValueVariousPrice(texto)
      }

      return (
        <div className='updateServiceModal'>
            <div className='updateServiceModal__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='updateServiceModal__btnCloseModal__prop'>X</div>
            </div>
            <div className='updateServiceModal__data'>
                <div className='updateServiceModal__data__label-input'>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateTitleVariousPrice?inputUpdateTitleVariousPrice:title} onChange={handleInputTitleUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateValueVariousPrice?inputUpdateValueVariousPrice:value} onChange={handleInputValueUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='updateServiceModal__btn'>
                <button onClick={handleBtnUpdateServiceValue} className='updateServiceModal__btn__prop'>Guardar</button>
            </div>
        </div>
        
      )
    }
    
    

  return (
    <>
        <NavBar/>
        {
          isLoggedIn && user.role=='admin'?
          <>
            <div className='configContainer'>
                <div className='configContainer__config'>

                    <div className='configContainer__config__title'>Configuración</div>

                    <div className='configContainer__config__hairdresser'>
                        <div className='configContainer__config__hairdresser__prop'>Peluqueros:</div>
                    </div>
                    <div className='configContainer__config__addHairdresser'>
                        <div className='configContainer__config__addHairdresser__addHairdresserContainer'>
                            <div className='configContainer__config__addHairdresser__addHairdresserContainer__input'>
                                <input value={inputAddHairdresser} onChange={handleInputAddHairdresser} placeholder='ingrese peluquero' type="text" className='configContainer__config__addHairdresser__addHairdresserContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addHairdresser__addHairdresserContainer__btn'>
                                <button onClick={handleBtnAddHairdresser} className='configContainer__config__addHairdresser__addHairdresserContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>
                    <div className='configContainer__config__hairdressersList'>
                      {
                        hairdressers.length != 0 &&
                        <div className='configContainer__config__hairdressersList__titleList'>- Lista de peluqueros -</div>
                      }
                        {

                          hairdressers.length == 0 ?
                            <div>Aún no existen peluqueros</div>
                          :
                          
                          hairdressers.map((hairdresser) => {
                            return(
                              <>
                                        <div className='configContainer__config__hairdressersList__item'>
                                            <div className='configContainer__config__hairdressersList__item__label'>
                                                <div className='configContainer__config__hairdressersList__item__label__prop'>{hairdresser.name}</div>
                                            </div>
                                            <div className='configContainer__config__hairdressersList__item__btn'>
                                                <button onClick={()=>{handleBtnDeleteHairdresser(hairdresser._id)}} className='configContainer__config__hairdressersList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>

                    <div className='configContainer__config__services'>
                        <div className='configContainer__config__services__prop'>Servicios:</div>
                    </div>
                    <div className='configContainer__config__addService'>
                        <div className='configContainer__config__addService__addServiceContainer'>
                            <div className='configContainer__config__addService__addServiceContainer__input'>
                                <input value={inputTitleService} onChange={handleInputTitleService} placeholder='ingrese servicio' type="text" className='configContainer__config__addService__addServiceContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__input'>
                                <input value={inputValueService} onChange={handleInputValueService} placeholder='ingrese valor' type="text" className='configContainer__config__addService__addServiceContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__select'>
                                <select className='configContainer__config__addService__addServiceContainer__select__prop'  value={selectCategoryService} onChange={(e) => {handleSelectCategoryService(e.target.value)}}>
                                    {selectPartnerNonPartner.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__btn'>
                                <button onClick={hanldeBtnAddService} className='configContainer__config__addService__addServiceContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>
                    <div className='configContainer__config__servicesList'>
                        <div className='configContainer__config__servicesList__titleList'>- Lista de servicios -</div>
                        <div className='configContainer__config__servicesList__category'>
                          <div className='configContainer__config__servicesList__category__prop'>No socios</div>
                        </div>
                        {
                            nonPartnersService.length == 0 ?
                            <div>Aún no existen servicios</div>
                            :
                            nonPartnersService.map((service) => {
                                return(
                                    <>
                                        <div className='configContainer__config__servicesList__item'>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>{service.title}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>$ {service.value}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__btn'>
                                                <button onClick={()=>{handleBtnOpenUpdateService(service._id,service.title,service.value)}} className='configContainer__config__servicesList__item__btn__prop'>Editar</button>
                                                <button onClick={()=>{handleBtnDeleteService(service._id)}} className='configContainer__config__servicesList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                        <div className='configContainer__config__servicesList__category'>
                          <div className='configContainer__config__servicesList__category__prop'>Socios</div>
                        </div>
                        {
                          partnersService.length == 0 ?
                            <div>Aún no existen servicios</div>
                          :
                            partnersService.map((service) => {
                                return(
                                    <>
                                        <div className='configContainer__config__servicesList__item'>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>{service.title}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>$ {service.value}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__btn'>
                                                <button onClick={()=>{handleBtnOpenUpdateService(service._id,service.title,service.value)}} className='configContainer__config__servicesList__item__btn__prop'>Editar</button>
                                                <button onClick={()=>{handleBtnDeleteService(service._id)}} className='configContainer__config__servicesList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>

                    <div className='configContainer__config__membershipFee'>
                        <div className='configContainer__config__membershipFee__prop'>Cuota socio:</div>
                    </div>

                    <div className='configContainer__config__membershipFeeList__item'>

                      <div className='configContainer__config__membershipFeeList__item__label'>
                          <div className='configContainer__config__membershipFeeList__item__label__prop'>Cuota socio:</div>
                      </div>

                      <div className='configContainer__config__membershipFeeList__item__label'>
                        {
                          membershipFee&&!updateInputMembershipFeeIsOpen?
                          <div className='configContainer__config__membershipFeeList__item__label__prop'>$ {membershipFee?membershipFee.value:''}</div>
                          :
                          <input className='configContainer__config__membershipFeeList__item__label__input' placeholder='ingrese valor cuota' value={inputMembershipFee} onChange={handleInputMembershipFee} type="text" />
                        }
                      </div>

                      <div className='configContainer__config__membershipFeeList__item__btn'>
                        {
                          !membershipFee?
                          <button onClick={handleBtnSaveMembershipFee} className='configContainer__config__membershipFeeList__item__btn__prop'>Guardar</button>
                          :
                          <>
                          {
                            updateInputMembershipFeeIsOpen?
                            <>
                            <button onClick={()=>{handleBtnUpdateMembershipFee(membershipFee._id)}} className='configContainer__config__membershipFeeList__item__btn__prop'>Guardar</button>
                            <button onClick={()=>setUpdateInputMembershipFeeIsOpen(false)} className='configContainer__config__membershipFeeList__item__btn__prop'>Cancelar</button>
                            </>
                            :
                            <button onClick={handleEditMembershipFee} className='configContainer__config__membershipFeeList__item__btn__prop'>Editar</button>
                          }
                          </>
                        }
                      </div>

                    </div>

                    <div className='configContainer__config__various'>
                        <div className='configContainer__config__various__prop'>Varios:</div>
                    </div>
                    <div className='configContainer__config__addVarious'>
                        <div className='configContainer__config__addVarious__addVariousContainer'>
                            <div className='configContainer__config__addVarious__addVariousContainer__input'>
                                <input value={inputAddTitleVariouPrice} onChange={handleInputAddTitleVariouPrice} placeholder='ingrese algo' type="text" className='configContainer__config__addVarious__addVariousContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addVarious__addVariousContainer__input'>
                                <input value={inputAddValueVariouPrice} onChange={handleInputAddValueVariouPrice} placeholder='ingrese valor' type="text" className='configContainer__config__addVarious__addVariousContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addVarious__addVariousContainer__btn'>
                                <button onClick={handleBtnAddVariouPrice} className='configContainer__config__addVarious__addVariousContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>

                    <div className='configContainer__config__variousList'>
                        {
                          pricesWithoutMembershipFee.length != 0 &&
                          <div className='configContainer__config__variousList__titleList'>- Varios -</div>
                        }
                        {
                          pricesWithoutMembershipFee.map((item) => {
                            return(
                                <>
                                    <div className='configContainer__config__variousList__item'>
                                        <div className='configContainer__config__variousList__item__label'>
                                            <div className='configContainer__config__variousList__item__label__prop'>{item.title}</div>
                                        </div>
                                        <div className='configContainer__config__variousList__item__label'>
                                            <div className='configContainer__config__variousList__item__label__prop'>$ {item.value}</div>
                                        </div>
                                        <div className='configContainer__config__variousList__item__btn'>
                                            <button onClick={()=>{handleBtnOpenUpdateVariousPrice(item._id,item.title,item.value)}} className='configContainer__config__variousList__item__btn__prop'>Editar</button>
                                            <button onClick={()=>{handleBtnDeleteVariouPrice(item._id,item.title)}} className='configContainer__config__variousList__item__btn__prop'>Borrar</button>
                                        </div>
                                    </div>
                                </>
                                )
                              })
                        }
                    </div>
                    <div className='configContainer__config__weekDays'>
                        <div className='configContainer__config__weekDays__prop'>Días laborales:</div>
                    </div>
                    <div className='configContainer__config__createWeekDay'>

                      <div className='configContainer__config__createWeekDay__hairdresser'>
                        <select className='configContainer__config__createWeekDay__hairdresser__select'  value={selectHairdressersWeekDays} onChange={(e) => {handleSelectHairdressersWeekDays(e.target.value)}}>
                            {hairdressersOptionsSelect.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                      </div>

                      <div className='configContainer__config__createWeekDay__day'>
                        <select className='configContainer__config__createWeekDay__day__select'  value={selectDaysWeekDays} onChange={(e) => {handleSelectDaysWeekDays(e.target.value)}}>
                            {weekDays.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                      </div>

                      <div className='configContainer__config__createWeekDay__scheduleBtn'>

                        <div className='configContainer__config__createWeekDay__scheduleBtn__schedule'>

                            {
                                !inputCreateWeekDayOpen?
                                <select className='configContainer__config__createWeekDay__scheduleBtn__schedule__select' value={selectScheduleWeekDays} onChange={(e) => {handleSelectScheduleWeekDays(e.target.value)}}>
                                    {schedulesWeekDays.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                :
                                <div className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules'>
                                    <input maxLength={2} value={inputCreateWeekDayH} onChange={handleInputCreateWeekDayH} onBlur={handleOnBlurInputCreateWeekDayH} className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules__input' type="text" />
                                    <div>:</div>
                                    <input maxLength={2} value={inputCreateWeekDayM} onChange={handleInputCreateWeekDayM} onBlur={handleOnBlurInputCreateWeekDayM} className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules__input' type="text" />
                                </div>
                            }

                        </div>

                        <div className='configContainer__config__createWeekDay__scheduleBtn__btn'>
                            
                            {
                                !inputCreateWeekDayOpen?
                                <button onClick={()=>setInputCreateWeekDayOpen(true)} className='configContainer__config__createWeekDay__scheduleBtn__btn__addSchedule'>Añadir</button>
                                :
                                <>
                                <button onClick={handleBtnCreateWeekDay} className='configContainer__config__createWeekDay__scheduleBtn__btn__goBack'>Crear</button>
                                <button onClick={()=>setInputCreateWeekDayOpen(false)} className='configContainer__config__createWeekDay__scheduleBtn__btn__goBack'>Atrás</button>
                                </>
                            }

                        </div>

                      </div>

                    </div>
                    <div className='configContainer__config__btnShowWorkDaysListContainer'>
                        {
                            !showWorkDaysList ?
                            <button className='configContainer__config__btnShowWorkDaysListContainer__btn' onClick={()=>setShowWorkDaysList(true)}>Editar horarios</button>
                            :
                            <button className='configContainer__config__btnShowWorkDaysListContainer__btn' onClick={()=>setShowWorkDaysList(false)}>Ocultar horarios</button>
                        }
                    </div>
                    {
                        showWorkDaysList&&
                            <div className='configContainer__config__workDaysList'>
                            {
                                workDaysByHairdresserWorkDayFiltered.map((workDay) => {
                                    return(
                                        <>
                                            <div className='configContainer__config__workDaysList__itemSchedule'>
                                                    <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn'>
                                                        <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__label'>
                                                            <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__label__prop'>{workDay.schedule}</div>
                                                        </div>
                                                        <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__btn'>
                                                            <button onClick={()=>{handleBtnDeleteScheduleWorkDay(workDay._id)}} className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__btn__prop'>Borrar</button>
                                                        </div>
                                                    </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            </div>
                    }
                        {
                          updateServiceBtnIsOpen&&<UpdateServiceModal setUpdateServiceBtnIsOpen={setUpdateServiceBtnIsOpen} id={idService} title={titleService} value={valueService} />
                        }
                        {
                          updateVariousPriceModal&&<UpdateVariousPriceModal setUpdateVariousPriceModal={setUpdateVariousPriceModal} id={idVariousPrice} title={titleVariousPrice} value={valueVariousPrice} />
                        }
                </div>
            </div>
            <LogOut/>
          </>
          :
          <>
            
          </>
        }
        <Footer/>
    </>
  )
}

export default Config