'use client'

import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { CreateReportTypes, Disease, ReportUser, userData } from '@/utils/types';
import { useAuthStore } from '@/store/useAuthStore';

const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const baseStyle = {
    width: '100%',
};

type Props = {
    modalForm: boolean,
    showModalForm: () => void,
    userData: userData | undefined,
    clearModal: () => void,
    diseases: Disease[],
    setLastReport: React.Dispatch<React.SetStateAction<ReportUser | undefined>>;
}

const { Option } = Select;
const FormReport = ({ modalForm, showModalForm, userData, clearModal, diseases }: Props) => {

    const [isClient, setIsClient] = useState(false);
    const [doctorName, setDoctorName] = useState("Dr. Juan Pérez");

    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [treatment, setTreatment] = useState<string>('');
    const [historyDisease, setHistoryDisease] = useState<string>('');
    const [loading, setLoading] = useState(false);



    const handleDiseaseChange = (value: any) => {
        setSelectedDisease(value);
        setSelectedVariant(null);  // Resetear la variante al cambiar la enfermedad
        setTreatment('');  // Resetear el tratamiento
    };

    const handleVariantChange = (value: any) => {
        setSelectedVariant(value);
        const selectedDiseaseObj = diseases.find(disease => disease.id === selectedDisease);
        if (selectedDiseaseObj) {
            const selectedVariantObj = selectedDiseaseObj.variants.find(variant => variant.id === value);
            if (selectedVariantObj) {
                setTreatment(selectedVariantObj.treatment);
                setHistoryDisease(selectedVariantObj.description)
                console.log("Tratamiento actualizado:", selectedVariantObj.description);  // Verifica si la descripción se está guardando
            }
        }
    };

    console.log(selectedVariant)

    const onFinish = async (data: CreateReportTypes) => {
        console.log('Received values of form: ', data);

        if (!selectedDisease || !selectedVariant) {
            // Maneja el error o alerta al usuario de que debe seleccionar ambos.
            return;
        }
        setLoading(true)
        try {
            const { data: response } = await axios.request({
                url: '/api/report/create',
                method: 'POST',
                data: {
                    code: "report-6546754",
                    affiliate_id: userData ? userData.id.toString() : '',
                    affiliate_name: data.affiliate_name,
                    social_security_number: data.social_security_number,
                    age: data.age,
                    phone: data.phone.toString(),
                    study_center: data.study_center,
                    procedure_center: data.procedure_center,
                    traffic_accident: data.traffic_accident,
                    center_id: 1,
                    disease_id: selectedDisease,
                    disease_variant_id: selectedVariant,
                    procedure_names: treatment,
                    current_disease_history: historyDisease,
                    //diagnosis: data.diagnosis,
                },
            });
            console.log('unexito:', response.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            showModalForm();
        }
    };

    return (
        <Modal
            title={<h5 className='text-3xl text-center'>Crear Reporte</h5>}
            open={modalForm}
            confirmLoading={true}
            onCancel={clearModal}
            centered
            footer={null}
            maskClosable={false}
            className="custom-modal-form"
        >
            <div className="modal-content max-w-5xl p-5">
                <Form
                    name='Create Report'
                    style={{ width: '100%' }}
                    className={`flex flex-col py-5 gap-5`}
                    onFinish={onFinish}
                    initialValues={{
                        //doctorName: auth,
                        code: userData?.id || 'no-data',
                        affiliate_name: userData?.firstname && userData?.lastname ? `${userData.firstname} ${userData.lastname}` : 'no-data',
                        idCard: userData?.document_no || "no-data",
                        social_security_number: userData?.social_id || "no-data",
                        age: userData?.age || 0,
                        phone: userData?.phone || 1234567891,
                        gender: userData?.gender || 'no-data',
                    }}>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Nombre del médico"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="doctorName"
                            rules={[{ required: true, message: 'Seleccione un médico' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} placeholder={'Seleccione un médico'}>
                                <Option value="doc1">médico 1</Option>
                                <Option value="doc2">médico 2</Option>
                                <Option value="doc3">médico 3</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Código"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="code"
                            rules={[{ required: true, message: 'Ingrese el código' }]}
                            style={baseStyle}
                        //hasFeedback
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Nombre del afiliado"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="affiliate_name"
                            rules={[{ required: true, message: 'Ingrese el nombre del afiliado' }]}
                            style={baseStyle}
                        >
                            <Input style={{ width: '100%' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label="NSS"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="social_security_number"
                            rules={[{ required: true, message: 'Ingrese el NSS' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </div>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Cédula"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="idCard"
                            rules={[{ required: true, message: 'Ingrese la cédula' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Edad"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="age"
                            rules={[{ required: true, message: 'Ingrese la edad' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </div>
                    {/* GENERO Y PHONE */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Sexo"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="gender"
                            rules={[{ required: true, message: 'Seleccione una opción' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} disabled>
                                <Option value="F">Femenino</Option>
                                <Option value="M">Masculino</Option>
                                {/* <Option value="demo3">Demo 3</Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Número de Teléfono"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="phone"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu teléfono' },
                                { pattern: /^[0-9]{10}$/, message: 'El número debe contener solo 10 dígitos' },
                            ]}
                            style={baseStyle}
                        >
                            <Input type="tel" placeholder="Introduce tu número de teléfono" disabled />
                        </Form.Item>
                    </div>
                    {/* SWITCH Y SELECT */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Centro de estudio"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="study_center"
                            rules={[{ required: true, message: 'Seleccione un centro' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} placeholder={'Seleccione un centro'}>
                                <Option value="demo1">Demo 1</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Centro de procedimiento"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="procedure_center"
                            rules={[{ required: true, message: 'Seleccione un centro' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} placeholder={'Seleccione un centro'}>
                                <Option value="demo1">Demo 1</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Accidente de tránsito?"
                        layout="vertical"
                        valuePropName="checked"
                        name="traffic_accident"
                        rules={[{ required: false, message: 'Indique si fue un accidente de tránsito' }]}
                        style={baseStyle}
                    >
                        <Switch />
                    </Form.Item>
                    {/* ENFERMEDAD Y VARIANTE */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Seleccione enfermedad"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="diseases"
                            rules={[{ required: true, message: 'Seleccione una enfermedad' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} onChange={handleDiseaseChange} placeholder={'Seleccione una enfermedad'}>
                                {diseases.map((value, id) => {
                                    return (
                                        <Option value={value.id} key={value.id}>{value.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Seleccione la variante"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="variants_names"
                            rules={[{ required: true, message: 'Seleccione una variante' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} onChange={handleVariantChange} placeholder={'Seleccione una variante'}>
                                {diseases
                                    .find(disease => disease.id === selectedDisease)
                                    ?.variants?.map(variant => {
                                        return (
                                            <Option key={variant.id} value={variant.id}>
                                                {variant.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </div>
                    {/* TEXT AREA */}
                    <div className='flex flex-col gap-5 w-full'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <p>Procedimiento a seguir</p>
                                <TextArea
                                    rows={4}
                                    value={treatment}
                                    disabled
                                    name='procedure_names'
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>Historia de la enfermedad</p>
                                <TextArea
                                    rows={4}
                                    value={historyDisease}
                                    disabled
                                />
                            </div>
                        </div>
                        <Form.Item
                            label="Antecedente patológico"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="diagnosis"
                            rules={[{ required: true, message: 'Ingrese el antecedente patológico' }]}
                            className='min-h-28'
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        {/* BUTTON */}
                        <div className='flex justify-center items-center w-full pt-5'>
                            <Form.Item>
                                <Button loading={loading} type="primary" htmlType="submit" size='large' className='w-full'>
                                    Crear Reporte
                                </Button>
                            </Form.Item>
                        </div>
                    </div>


                </Form>
            </div>
        </Modal>
    );
}

export default FormReport;
