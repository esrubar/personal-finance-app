import React, { useEffect, useState } from 'react'
import { Layout, Tabs, Card, Form, Input, Button, message, Table, Space } from 'antd'
import api from '../services/api'

const { Header, Content, Footer } = Layout

interface User {
  _id: string
  email: string
  createdAt: string
}

interface Expense {
  _id: string
  title: string
  amount: number
  createdAt: string
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await api.post('/api/auth/login', values)
      message.success('Login correcto')
      onSuccess()
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Error de login')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Entrar</Button>
    </Form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await api.post('/api/auth/register', values)
      message.success('Usuario creado')
      onSuccess()
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Error de registro')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Crear cuenta</Button>
    </Form>
  )
}

function Expenses() {
  const [items, setItems] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/expenses')
      setItems(data.data)
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Error cargando gastos')
    } finally {
      setLoading(false)
    }
  }

  const onAdd = async (values: any) => {
    setLoading(true)
    try {
      await api.post('/api/expenses', values)
      form.resetFields()
      await load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Error creando gasto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Nuevo gasto">
        <Form form={form} layout="inline" onFinish={onAdd}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Título" />
          </Form.Item>
          <Form.Item name="amount" rules={[{ required: true }]}>
            <Input type="number" placeholder="Importe" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Añadir</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Gastos">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={items}
          columns={[
            { title: 'Título', dataIndex: 'title' },
            { title: 'Importe', dataIndex: 'amount' },
            { title: 'Fecha', dataIndex: 'createdAt' },
          ]}
        />
      </Card>
    </Space>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  const onLogout = async () => {
    try {
      await api.post('/api/auth/logout')
      setUser(null)
    } catch {}
  }

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontWeight: 'bold' }}>Personal Finance</Header>
      <Content style={{ padding: 24, maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {!user ? (
          <Card>
            <Tabs
              items={[
                { key: 'login', label: 'Login', children: <LoginForm onSuccess={fetchMe} /> },
                { key: 'register', label: 'Registro', children: <RegisterForm onSuccess={fetchMe} /> },
              ]}
            />
          </Card>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>Sesión iniciada como <b>{user.email}</b></div>
                <Button onClick={onLogout}>Salir</Button>
              </Space>
            </Card>
            <Expenses />
          </Space>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Personal Finance</Footer>
    </Layout>
  )
}