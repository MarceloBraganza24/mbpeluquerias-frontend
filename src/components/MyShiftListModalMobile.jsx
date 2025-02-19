import React, { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext'; 
import moment from 'moment-timezone'

const MyShiftListModalMobile = ({id,hairdresser,first_name,last_name,service,email,date,schedule,handleUpdateMyShiftModalMobileLocal,shifts,holidaysData}) => {
    const adjustedDate = moment.tz(date, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
    const formatAdjustedDate = moment(adjustedDate).format('YYYY-MM-DD')
    const adjustedNewDatee = new Date(adjustedDate);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [confirmationDelShiftsModal, handleConfirmationDelShiftsModal] = useState(false);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const {handleUpdateMyShiftModalMobile} = useContext(OpenModalContext);
    const [hairdressers, setHairdressers] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [workDays, setWorkDays] = useState([]);
    const [services, setServices] = useState([]);
    //const optionsService = ['Elija su servicio'];
    /*const noPartnersServices = services.filter(service => service.category == 'No socio')
    optionsService.push(`${service}`);
    noPartnersServices.forEach(res => {
        optionsService.push(res.title)
    }) */
    
    const optionsHairdresser = ['Peluquero'];
    //optionsHairdresser.push(`${hairdresser}`);
    hairdressers.forEach(res => {
        optionsHairdresser.push(res.name)
    })
    
    const [expiredDate, setExpiredDate] = useState(false);
    
    const [selectHairdresserISh, setSelectHairdresserISh] = useState(`${hairdresser}`);
    const [inputFirstNameISh, setInputFirstNameISh] = useState('');
    const [inputLastNameISh, setInputLastNameISh] = useState('');
    const [inputServiceISh, setInputServiceISh] = useState(`${service}`);
    const [inputEmailISh, setInputEmailISh] = useState('');
    const [inputDateISh, setInputDateISh] = useState(`${adjustedDate}`);
    const [selectScheduleOptionISh, setSelectScheduleOptionISh] = useState('');

    const formatInputDate = moment(inputDateISh).format('YYYY-MM-DD')
    const concatDateSchedule = (formatInputDate) + ' ' + (selectScheduleOptionISh?selectScheduleOptionISh:schedule)
    const dateMShLFormated = new Date(concatDateSchedule);

    let fechaActual = new Date();

    const servicesByCaegory = services.filter(item => item.category == 'No socio')
    const servicesWithOutService = servicesByCaegory.filter(item => item.title != service)
    const optionsService = [];
    optionsService.push(service)
    servicesWithOutService.forEach(item => {
        optionsService.push(item.title)
    })

    useEffect(() => {
        if(dateMShLFormated < fechaActual) {
            setExpiredDate(true);
        }
        setHolidays(holidaysData)
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
        async function fetchHolidaysData() {
            const response = await fetch(`${apiUrl}/api/holidays`)
            const holidaysAll = await response.json();
            setHolidays(holidaysAll.data)
        }
        fetchHolidaysData();
        async function fetchWorkDaysData() {
            const response = await fetch(`${apiUrl}/api/workDays`)
            const workDaysAll = await response.json();
            setWorkDays(workDaysAll.data)
        }
        fetchWorkDaysData();
    },[])
    
    const handleInputFirstNameISh = (e) => {
        const texto = e.target.value.replace(/[^A-Za-zñÑ\s]/gi, '');
        setInputFirstNameISh(texto);
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputLastNameISh = (e) => {
        const texto = e.target.value.replace(/[^A-Za-zñÑ\s]/gi, '');
        setInputLastNameISh(texto);
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleSelectServiceISh = (e) => {
        setInputServiceISh(e);
        e===service?setInputChanges(false):setInputChanges(true);
        e===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleSelectHairdresserISh = (e) => {
        setSelectHairdresserISh(e.target.value);
        e.target.value===hairdresser?setInputChanges(false):setInputChanges(true);
        e.target.value===''&&setInputChanges(false);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputEmailISh = (e) => {
        const texto = e.target.value;
        setInputEmailISh(texto);
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };
    
    const handleSelectScheduleOptionISh = (e) => {
        const texto = e.target.value;
        setSelectScheduleOptionISh(texto);
        texto==schedule?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(inputDateISh.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
    };

    const handleDateChange = date => {
        date&&setInputDateISh(date);
        const newDate = new Date(date)
        if(newDate.getTime() == adjustedNewDatee.getTime()) {
            setInputChanges(false)
        } else {
            setInputChanges(true);
        }
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleBtnDelShift = async() => {
        handleConfirmationDelShiftsModal(true);
    };

    const fecha15DiasDespues = new Date(fechaActual);
    fecha15DiasDespues.setDate(fechaActual.getDate() + 15);

    const dateToCompareHoliday = {
        date: formatInputDate?formatInputDate:adjustedDate,
        hairdresser: selectHairdresserISh
    }
    const existsHoliday = holidays.some(holiday =>
        holiday.date == dateToCompareHoliday.date &&
        holiday.hairdresser == dateToCompareHoliday.hairdresser
    );

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==6&&'Sabado')))
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==2&&'Martes'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==3&&'Miercoles'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==4&&'Jueves'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==5&&'Viernes'))) 
    )

    const schedulesByHairdresserDate = workDaysByHairdresserWorkDayFiltered.map(item => item.schedule)
    schedulesByHairdresserDate.sort((a, b) => {
        const timeA = a.split(':').map(Number);
        const timeB = b.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
        
        return totalMinutesA - totalMinutesB;
    });

    const existsUniqueHairdresserSchedules = schedulesByHairdresserDate.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);


    const shiftsFiltered = shifts.filter(shift => shift.hairdresser == selectHairdresserISh && shift.date == formatInputDate);
    const schedulesHairdressersFilteredByNotCancel = shiftsFiltered.map(item => item.schedule)

    const optionsScheduleISh = [];
    
    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));

    optionsScheduleISh.push(`${schedule}`);
    filteredArray.forEach(res => {
        optionsScheduleISh.push(res)
    })

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdShift = async() => {
        document.getElementById('btnUpdateShift').style.display = 'none';
        setShowSpinner(true);

        if((selectHairdresserISh == hairdresser || selectHairdresserISh == '') && (inputFirstNameISh == first_name || inputFirstNameISh == '') && (inputLastNameISh == last_name || inputLastNameISh == '') && (inputServiceISh == service || inputServiceISh == '') && (inputEmailISh == email || inputEmailISh == '') && (formatAdjustedDate == formatInputDate) && (selectScheduleOptionISh == schedule || selectScheduleOptionISh == '')) {
            toast('No tienes cambios para actualizar!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if (dateMShLFormated.getDay() == 0 || dateMShLFormated.getDay() == 1) {
            toast('Elige un dia entre martes y sabado!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(existsHoliday) {
            toast('En la fecha ingresada el peluquero se encuenta de vacaciones', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(!existsUniqueHairdresserSchedules){
            toast('El horario no esta permitido para el día de semana seleccionado del peluquero elegido', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(dateMShLFormated < fechaActual) {
            toast('Debes ingresar una fecha a futuro', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(selectHairdresserISh == 'Peluquero' || selectHairdresserISh == '') {
            toast('Debes elegir un peluquero', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(dateMShLFormated > fecha15DiasDespues) {
            toast('Debes ingresar una fecha con 15 dias de anticipacion como máximo', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if (!isValidUTF8(inputFirstNameISh?inputFirstNameISh:first_name)) {
            toast('El campo nombre contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                setShowSpinner(false);
                document.getElementById('btnUpdateShift').style.display = 'block';
            }, 1500);
        } else if (!isValidUTF8(inputLastNameISh?inputLastNameISh:last_name)) {
            toast('El campo apellido contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                setShowSpinner(false);
                document.getElementById('btnUpdateShift').style.display = 'block';
            }, 1500);
        } else if (!isValidUTF8(inputEmailISh?inputEmailISh:email)) {
            toast('El campo email contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                setShowSpinner(false);
                document.getElementById('btnUpdateShift').style.display = 'block';
            }, 1500);
        } else {
            const shiftToUpdate = {
                hairdresser: selectHairdresserISh,
                first_name: inputFirstNameISh?inputFirstNameISh:first_name,
                last_name: inputLastNameISh?inputLastNameISh:last_name,
                service: inputServiceISh?inputServiceISh:service,
                email: inputEmailISh?inputEmailISh:email,
                date: formatInputDate?formatInputDate:adjustedDate,
                schedule: selectScheduleOptionISh?selectScheduleOptionISh:schedule
            }
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(shiftToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el turno correctamente!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    handleUpdateMyShiftModalMobileLocal(false);
                    handleUpdateMyShiftModalMobile(false);
                    setInputChanges(false)
                }, 1500);
            } else if(data.error === 'There is already a shift with that date and time') {
                toast('Ya existe un turno con esa fecha y horario del peluquero elegido!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdateShift').style.display = 'block';
                setShowSpinner(false);
            } else {
                toast('Ha ocurrido un error, intente nuevamente!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    handleUpdateMyShiftModalMobileLocal(false);
                    handleUpdateMyShiftModalMobile(false);
                    setInputChanges(false)
                }, 1500);
            }
        }
    };

    const ConfirmationDeleteModal = ({formatInputDate,schedule}) => {
        const handleBtnDelShift = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.ok) {
                toast('Has eliminado el turno correctamente!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    handleConfirmationDelShiftsModal(false);
                    handleUpdateMyShiftModalMobile(false);
                    handleUpdateMyShiftModalMobileLocal(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el turno!', {
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
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelShiftsModal(false)
        }

        return (
            <>
                <div className='confirmationDeleteBtnMyShiftListModalContainer'>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__ask'>¿Estás seguro que deseas borrar el turno con fecha {formatInputDate} {schedule}?</div>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el turno con fecha {formatInputDate} {schedule}?</div>
                    </div>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelShift} className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateMyShiftModalMobile(false);
        handleUpdateMyShiftModalMobileLocal(false);
    }

    const unsavedChanges = () => {
        toast('No has actualizado los cambios!', {
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

    const inputSelectDisabledStyle = {
        color: 'black',
        backgroundColor: 'white'
    };

    return (
    <>
        <div className='myShiftModalContainerMobile'>
            <div className='myShiftModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelShiftsModal&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='myShiftModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='myShiftModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelShiftsModal&&!expiredDate?
                <>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Nombre</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Apellido</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Email</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input className='myShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Peluquero</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectHairdresserISh} onChange={handleSelectHairdresserISh}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Servicio</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectService'>
                            <select className='myShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Fecha</div>
                        <DatePicker className='myShiftModalContainerMobile__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Horario</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                {optionsScheduleISh.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__btns'>
                        <button className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        <button id='btnUpdateShift' className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnUpdShift}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Nombre</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Apellido</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Email</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Peluquero</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectHairdresserISh} onChange={handleSelectHairdresserISh}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Servicio</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectService'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Fecha</div>
                        <DatePicker className='myShiftModalContainerMobile__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            disabled
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Horario</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                {optionsScheduleISh.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__btns'>
                        <button className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        <button disabled id='btnUpdateShift' className='myShiftModalContainerMobile__btns__btn'>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            
            {
                confirmationDelShiftsModal&&<ConfirmationDeleteModal formatInputDate={formatInputDate} schedule={schedule}/>
            }
        </div>
    </>
    )
}

export default MyShiftListModalMobile