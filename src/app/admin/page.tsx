'use client'

import ListUsers from '@/components/form/ListUsers'
import SideBar from '@/components/layout/SideBar'
import FormReport from '@/components/reportList/FormReport'
import SearchUser from '@/components/reportList/SearchUser'
import { Disease, ReportUser, userData } from '@/utils/types'
import { UserOutlined } from '@ant-design/icons'
import { Button, Divider, InputNumber, Modal } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const PageAdmin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [modalIdUser, setModalIdUser] = useState(false);
    const [modalForm, setModalForm] = useState(false);

    // USERS
    const showModalUser = () => {
        setIdUser(undefined);
        setModalIdUser(!modalIdUser);
    };

    // FORM
    const showModalForm = () => {
        setModalForm(!modalForm);
    };

    const clearModal = () => {
        setModalForm(false)
        setUserData(undefined)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    //OBTENER ENFERMEDADES

    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (hasRun || !modalForm) return;
        async function handleGetDiseasesList() {
            try {
                const { data: res } = await axios.request({
                    method: 'GET',
                    url: '/api/disease/getAll',
                });
                setDiseases(res.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        handleGetDiseasesList();
        setHasRun(true);
    }, [modalForm, hasRun]);

    // OBETENER ID DE USUARIO Y DATA USER 

    const [idUser, setIdUser] = useState<number | undefined>(undefined);
    const [userData, setUserData] = useState<userData>();
    const [loading, setLoading] = useState(false);
    const [errorSearchUser, setErrorSearchUser] = useState(false);
    const [lastReport, setLastReport] = useState<ReportUser>();
    const [successReport, setSuccessReport] = useState(false);

    const handleInputChange = (value: number) => {
        setIdUser(value);
    };

    const handleOk = async () => {
        setErrorSearchUser(false)
        setLoading(true);
        try {
            const { data: res } = await axios.request({
                method: 'POST',
                url: '/api/user/id',
                data: { paciente_id: idUser }
            });
            if (res.error) {
                setErrorSearchUser(true);
            } else if (res.data && res.code === 200) {
                setUserData(res.data);
                showModalUser();
                showModalForm();
            }
        } catch (error) {
            setErrorSearchUser(true);
            console.error(error);
            alert("Hubo un error al procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };



    return (
        isLoading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
            <>
                <SideBar/>
            </>
        )
    )
}

export default PageAdmin