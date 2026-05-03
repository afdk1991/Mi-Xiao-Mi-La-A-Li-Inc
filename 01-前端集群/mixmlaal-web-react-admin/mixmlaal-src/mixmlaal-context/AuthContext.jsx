import { createContext, useContext, useReducer, useEffect } from 'react'
import { loginAPI } from '../services/api'

const AuthContext = createContext()

const initialState = {
  isLogin: false,
  userInfo: null,
  token: localStorage.getItem('adminToken') || '',
  loading: false
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLogin: true,
        userInfo: action.payload.userInfo,
        token: action.payload.token,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        isLogin: false,
        userInfo: null,
        token: '',
        loading: false
      }
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (loginForm) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await loginAPI.login(loginForm)
      const token = res.data.token
      localStorage.setItem('adminToken', token)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { userInfo: res.data.userInfo, token }
      })
      return res
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      await loginAPI.logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      localStorage.removeItem('adminToken')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await loginAPI.getUserInfo()
      dispatch({ type: 'SET_USER_INFO', payload: res.data })
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  useEffect(() => {
    if (state.token) {
      getUserInfo()
    }
  }, [state.token])

  return (
    <AuthContext.Provider value={{ state, login, logout, getUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
