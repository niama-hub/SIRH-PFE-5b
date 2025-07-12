"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  Building2,
  X,
  ChevronDown,
  Trash2,
  ArrowLeft,
  Menu,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function HRManagementSystem() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false)
  const [showNewDepartmentForm, setShowNewDepartmentForm] = useState(false)
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    startDate: "",
    salary: "",
    manager: "",
  })
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    manager: "",
    budget: "",
  })
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeName: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState(null)

  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    position: "",
  })

  const [leaveDateFilter, setLeaveDateFilter] = useState({
    startDate: "",
    endDate: "",
  })

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?"
    const words = name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
    if (words.length === 0) return "?"

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  // Notification helper functions
  const showSuccessToast = (title, description) => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>{title}</span>
        </div>
      ),
      description,
    })
  }

  const showErrorToast = (title, description) => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4" />
          <span>{title}</span>
        </div>
      ),
      description,
    })
  }

  const showWarningToast = (title, description) => {
    toast({
      variant: "warning",
      title: (
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{title}</span>
        </div>
      ),
      description,
    })
  }

  const showInfoToast = (title, description) => {
    toast({
      variant: "default",
      title: (
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>{title}</span>
        </div>
      ),
      description,
    })
  }

  // Fonction pour charger les employés depuis localStorage
  const loadEmployeesFromStorage = () => {
    if (typeof window !== "undefined") {
      const savedEmployees = localStorage.getItem("hrms-employees")
      if (savedEmployees) {
        return JSON.parse(savedEmployees)
      }
    }
    return [
      {
        id: 1,
        name: "Fatima Zahra Benali",
        position: "Développeuse Senior",
        department: "IT",
        email: "fatima.benali@company.ma",
        phone: "+212 6 12 34 56 78",
        startDate: "2022-03-15",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "65000",
        manager: "Ahmed Alami",
      },
      {
        id: 2,
        name: "Youssef Tazi",
        position: "Chef de Projet",
        department: "Marketing",
        email: "youssef.tazi@company.ma",
        phone: "+212 6 12 34 56 79",
        startDate: "2021-09-01",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "58000",
        manager: "Khadija Senhaji",
      },
      {
        id: 3,
        name: "Khadija Senhaji",
        position: "Directrice Marketing",
        department: "Marketing",
        email: "khadija.senhaji@company.ma",
        phone: "+212 6 12 34 56 80",
        startDate: "2020-01-10",
        status: "Actif", // Initial status, will be updated by useEffect
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "75000",
        manager: "Direction",
      },
      {
        id: 4,
        name: "Omar Fassi",
        position: "Comptable",
        department: "Finance",
        email: "omar.fassi@company.ma",
        phone: "+212 6 12 34 56 81",
        startDate: "2023-06-01",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "45000",
        manager: "Aicha Berrada",
      },
      {
        id: 5,
        name: "Zineb Idrissi",
        position: "Ancienne Développeuse",
        department: "IT",
        email: "zineb.idrissi@company.ma",
        phone: "+212 6 12 34 56 82",
        startDate: "2019-05-15",
        status: "Inactif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "55000",
        manager: "Ahmed Alami",
        inactiveDate: "2024-01-15",
      },
      {
        id: 6,
        name: "Ahmed Alami",
        position: "Directeur IT",
        department: "IT",
        email: "ahmed.alami@company.ma",
        phone: "+212 6 12 34 56 83",
        startDate: "2018-01-10",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "85000",
        manager: "Direction",
      },
      {
        id: 7,
        name: "Aicha Berrada",
        position: "Directrice Finance",
        department: "Finance",
        email: "aicha.berrada@company.ma",
        phone: "+212 6 12 34 56 84",
        startDate: "2019-03-01",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "78000",
        manager: "Direction",
      },
      {
        id: 8,
        name: "Hassan Cherkaoui",
        position: "Analyste Marketing",
        department: "Marketing",
        email: "hassan.cherkaoui@company.ma",
        phone: "+212 6 12 34 56 85",
        startDate: "2023-02-01",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "42000",
        manager: "Khadija Senhaji",
      },
      {
        id: 9,
        name: "Salma Bennani",
        position: "Développeuse Junior",
        department: "IT",
        email: "salma.bennani@company.ma",
        phone: "+212 6 12 34 56 86",
        startDate: "2023-09-15",
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
        salary: "38000",
        manager: "Ahmed Alami",
      },
    ]
  }

  // Fonction pour charger les départements depuis localStorage
  const loadDepartmentsFromStorage = () => {
    if (typeof window !== "undefined") {
      const savedDepartments = localStorage.getItem("hrms-departments")
      if (savedDepartments) {
        return JSON.parse(savedDepartments)
      }
    }
    return [
      { id: 1, name: "IT", description: "Technologies de l'information", manager: "Ahmed Alami", budget: "450000" },
      {
        id: 2,
        name: "Marketing",
        description: "Marketing et Communication",
        manager: "Khadija Senhaji",
        budget: "320000",
      },
      { id: 3, name: "Finance", description: "Finance et Comptabilité", manager: "Aicha Berrada", budget: "280000" },
      { id: 4, name: "RH", description: "Ressources Humaines", manager: "Nadia Lahlou", budget: "180000" },
    ]
  }

  // Fonction pour charger les demandes de congés depuis localStorage
  const loadLeaveRequestsFromStorage = () => {
    if (typeof window !== "undefined") {
      const savedLeaves = localStorage.getItem("hrms-leave-requests")
      if (savedLeaves) {
        return JSON.parse(savedLeaves)
      }
    }
    const today = new Date()
    const startDate1 = new Date(today)
    startDate1.setDate(today.getDate() - 5) // Starts 5 days ago
    const endDate1 = new Date(today)
    endDate1.setDate(today.getDate() + 5) // Ends 5 days from now

    const startDate2 = new Date(today)
    startDate2.setDate(today.getDate() - 2) // Starts 2 days ago
    const endDate2 = new Date(today)
    endDate2.setDate(today.getDate() + 8) // Ends 8 days from now

    return [
      {
        id: 1,
        employeeName: "Fatima Zahra Benali",
        type: "Congés payés",
        startDate: "2024-02-15",
        endDate: "2024-02-25",
        days: 8,
        status: "En attente",
        reason: "Vacances d'hiver",
      },
      {
        id: 2,
        employeeName: "Youssef Tazi",
        type: "Congé maladie",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        days: 2,
        status: "Approuvé",
        reason: "Grippe",
      },
      {
        id: 3,
        employeeName: "Omar Fassi",
        type: "RTT",
        startDate: "2024-02-10",
        endDate: "2024-02-10",
        days: 1,
        status: "Approuvé",
        reason: "Pont du weekend",
      },
      {
        id: 4,
        employeeName: "Hassan Cherkaoui",
        type: "Congés payés",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        days: 5,
        status: "En attente",
        reason: "Vacances de printemps",
      },
      {
        id: 5,
        employeeName: "Khadija Senhaji",
        type: "Congés payés",
        startDate: startDate1.toISOString().split("T")[0],
        endDate: endDate1.toISOString().split("T")[0],
        days: 11,
        status: "Approuvé",
        reason: "Voyage personnel (test 1)",
      },
      {
        id: 6,
        employeeName: "Youssef Tazi",
        type: "RTT",
        startDate: startDate2.toISOString().split("T")[0],
        endDate: endDate2.toISOString().split("T")[0],
        days: 11,
        status: "Approuvé",
        reason: "Repos (test 2)",
      },
    ]
  }

  // Calculate leave days earned based on employment duration
  const calculateLeaveBalance = (employee) => {
    if (!employee.startDate) return { earned: 0, used: 0, available: 0 }

    const startDate = new Date(employee.startDate)
    const currentDate = new Date()

    // Calculate months worked (including partial months)
    const monthsWorked =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth()) +
      (currentDate.getDate() >= startDate.getDate() ? 0 : -1)

    // 1.5 days per month worked
    const earnedDays = Math.max(0, Math.floor(monthsWorked * 1.5))

    // Calculate used days from approved leave requests
    const usedDays = leaveRequests
      .filter((req) => req.employeeName === employee.name && req.status === "Approuvé")
      .reduce((total, req) => total + req.days, 0)

    const availableDays = Math.max(0, earnedDays - usedDays)

    return {
      earned: earnedDays,
      used: usedDays,
      available: availableDays,
      monthsWorked: Math.max(0, monthsWorked),
    }
  }

  // Check if employee is currently on leave
  const isEmployeeOnLeave = (employeeName) => {
    const currentDate = new Date()
    return leaveRequests.some((req) => {
      if (req.employeeName !== employeeName || req.status !== "Approuvé") return false

      const startDate = new Date(req.startDate)
      const endDate = new Date(req.endDate)
      return currentDate >= startDate && currentDate <= endDate
    })
  }

  // Check for overlapping leave requests
  const hasOverlappingLeave = (employeeName, startDate, endDate, excludeId = null) => {
    const newStart = new Date(startDate)
    const newEnd = new Date(endDate)

    return leaveRequests.some((req) => {
      if (req.employeeName !== employeeName || req.status === "Refusé") return false
      if (excludeId && req.id === excludeId) return false

      const existingStart = new Date(req.startDate)
      const existingEnd = new Date(req.endDate)

      // Check for overlap
      return newStart <= existingEnd && newEnd >= existingStart
    })
  }

  // Fonctions de sauvegarde
  const saveEmployeesToStorage = (employeesList) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hrms-employees", JSON.stringify(employeesList))
    }
  }

  const saveDepartmentsToStorage = (departmentsList) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hrms-departments", JSON.stringify(departmentsList))
    }
  }

  const saveLeaveRequestsToStorage = (leavesList) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hrms-leave-requests", JSON.stringify(leavesList))
    }
  }

  // useEffect pour charger les données au démarrage
  useEffect(() => {
    setEmployees(loadEmployeesFromStorage())
    setDepartments(loadDepartmentsFromStorage())
    setLeaveRequests(loadLeaveRequestsFromStorage())
  }, [])

  // useEffect to synchronize employee status with leave requests
  useEffect(() => {
    // Don't run until data is loaded
    if (employees.length === 0 || leaveRequests.length === 0) return

    const currentDate = new Date()

    let hasChanges = false

    const updatedEmployeesList = employees.map((emp) => {
      // We only care about employees who are 'Actif' or 'En congé'
      if (emp.status !== "Actif" && emp.status !== "En congé") {
        return emp
      }

      const isOnLeave = leaveRequests.some((req) => {
        if (req.employeeName !== emp.name || req.status !== "Approuvé") return false

        const startDate = new Date(req.startDate)
        const endDate = new Date(req.endDate)
        endDate.setHours(23, 59, 59, 999) // Make it inclusive of the whole day
        return currentDate >= startDate && currentDate <= endDate
      })

      const newStatus = isOnLeave ? "En congé" : "Actif"

      if (emp.status !== newStatus) {
        hasChanges = true
        return { ...emp, status: newStatus }
      }

      return emp
    })

    if (hasChanges) {
      setEmployees(updatedEmployeesList)
      saveEmployeesToStorage(updatedEmployeesList)
    }
  }, [leaveRequests]) // Rerun only when leaveRequests change

  const getDepartmentStats = () => {
    const deptStats = {}

    // Initialiser avec tous les départements
    departments.forEach((dept) => {
      deptStats[dept.name] = {
        count: 0,
        baseBudget: Number.parseInt(dept.budget || 0),
        employeeSalaries: 0,
        manager: dept.manager,
        description: dept.description,
      }
    })

    // Compter les employés et calculer les salaires par département
    employees.forEach((emp) => {
      if (emp.department && deptStats[emp.department]) {
        deptStats[emp.department].count++
        deptStats[emp.department].employeeSalaries += Number.parseInt(emp.salary || 0)
      }
    })

    // Calculer le budget total (budget de base + salaires)
    Object.keys(deptStats).forEach((deptName) => {
      deptStats[deptName].totalBudget = deptStats[deptName].baseBudget + deptStats[deptName].employeeSalaries
    })

    return deptStats
  }

  // Calculs réactifs pour le dashboard - FIXED ORDER
  const departmentStats = getDepartmentStats()

  const getDashboardStats = () => {
    const totalEmployees = employees.length
    const totalDepartments = departments.length
    const pendingLeaves = leaveRequests.filter((req) => req.status === "En attente").length
    const totalBudget = Object.values(departmentStats).reduce((sum, dept) => sum + dept.totalBudget, 0)

    return {
      totalEmployees,
      totalDepartments,
      pendingLeaves,
      totalBudget,
    }
  }

  const dashboardStats = getDashboardStats()

  const dynamicDepartments = Object.entries(departmentStats).map(([name, stats]) => ({
    name,
    employees: stats.count,
    budget: `${stats.totalBudget.toLocaleString()} MAD`,
    baseBudget: `${stats.baseBudget.toLocaleString()} MAD`,
    salariesBudget: `${stats.employeeSalaries.toLocaleString()} MAD`,
    manager: stats.manager,
    description: stats.description,
  }))

  // Enhanced filtering function
  const filteredEmployees = employees.filter((employee) => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !searchLower ||
      (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
      (employee.department && employee.department.toLowerCase().includes(searchLower)) ||
      (employee.position && employee.position.toLowerCase().includes(searchLower)) ||
      (employee.email && employee.email.toLowerCase().includes(searchLower))

    // Department filter
    const matchesDepartment = !filters.department || employee.department === filters.department

    // Status filter
    const matchesStatus = !filters.status || employee.status === filters.status

    // Position filter
    const matchesPosition = !filters.position || employee.position === filters.position

    return matchesSearch && matchesDepartment && matchesStatus && matchesPosition
  })

  // Get unique positions for filter dropdown
  const uniquePositions = [...new Set(employees.map((emp) => emp.position).filter(Boolean))]
  const uniqueStatuses = [...new Set(employees.map((emp) => emp.status).filter(Boolean))]

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      department: "",
      status: "",
      position: "",
    })
    setSearchTerm("")
  }

  // Check if any filters are active
  const hasActiveFilters = filters.department || filters.status || filters.position || searchTerm

  const getStatusColor = (status) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800"
      case "En congé":
        return "bg-yellow-100 text-yellow-800"
      case "Inactif":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case "Approuvé":
        return "bg-green-100 text-green-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Refusé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.position) {
      const employee = {
        id: Math.max(...employees.map((e) => e.id), 0) + 1,
        ...newEmployee,
        status: "Actif",
        avatar: "/placeholder.svg?height=40&width=40",
      }
      const updatedEmployees = [...employees, employee]
      setEmployees(updatedEmployees)
      saveEmployeesToStorage(updatedEmployees)
      setShowNewEmployeeForm(false)
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
        startDate: "",
        salary: "",
        manager: "",
      })
      showSuccessToast("Employé ajouté", `${employee.name} a été ajouté avec succès au système.`)
    } else {
      showErrorToast("Erreur", "Veuillez remplir tous les champs obligatoires (nom, email, poste).")
    }
  }

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.description) {
      const department = {
        id: Math.max(...departments.map((d) => d.id), 0) + 1,
        ...newDepartment,
      }
      const updatedDepartments = [...departments, department]
      setDepartments(updatedDepartments)
      saveDepartmentsToStorage(updatedDepartments)
      setShowNewDepartmentForm(false)
      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        budget: "",
      })
      showSuccessToast("Département créé", `Le département ${department.name} a été créé avec succès.`)
    } else {
      showErrorToast("Erreur", "Veuillez remplir tous les champs obligatoires (nom et description).")
    }
  }

  const handleAddLeaveRequest = () => {
    if (newLeaveRequest.employeeName && newLeaveRequest.type && newLeaveRequest.startDate && newLeaveRequest.endDate) {
      const startDate = new Date(newLeaveRequest.startDate)
      const endDate = new Date(newLeaveRequest.endDate)
      const currentDate = new Date()

      // Validation checks
      if (startDate < currentDate) {
        showErrorToast("Date invalide", "La date de début ne peut pas être dans le passé !")
        return
      }

      if (endDate < startDate) {
        showErrorToast("Date invalide", "La date de fin doit être après la date de début !")
        return
      }

      // Check if employee is currently on leave
      if (isEmployeeOnLeave(newLeaveRequest.employeeName)) {
        showWarningToast(
          "Employé en congé",
          "Cet employé est actuellement en congé. Impossible d'ajouter une nouvelle demande.",
        )
        return
      }

      // Check for overlapping leave requests
      if (hasOverlappingLeave(newLeaveRequest.employeeName, newLeaveRequest.startDate, newLeaveRequest.endDate)) {
        showWarningToast("Conflit de dates", "Cette demande chevauche avec une autre demande de congé existante !")
        return
      }

      const timeDiff = endDate.getTime() - startDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

      // Find employee and check leave balance
      const employee = employees.find((emp) => emp.name === newLeaveRequest.employeeName)
      if (employee) {
        const leaveBalance = calculateLeaveBalance(employee)

        if (daysDiff > leaveBalance.available) {
          showErrorToast(
            "Solde insuffisant",
            `Solde de congés insuffisant ! Disponible: ${leaveBalance.available} jours, Demandé: ${daysDiff} jours`,
          )
          return
        }
      }

      const leaveRequest = {
        id: Math.max(...leaveRequests.map((l) => l.id), 0) + 1,
        ...newLeaveRequest,
        days: daysDiff,
        status: "En attente",
      }
      const updatedRequests = [...leaveRequests, leaveRequest]
      setLeaveRequests(updatedRequests)
      saveLeaveRequestsToStorage(updatedRequests)
      setShowNewLeaveForm(false)
      setNewLeaveRequest({
        employeeName: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      })
      showSuccessToast(
        "Demande créée",
        `Demande de congé pour ${leaveRequest.employeeName} créée avec succès (${daysDiff} jours).`,
      )
    } else {
      showErrorToast("Erreur", "Veuillez remplir tous les champs obligatoires.")
    }
  }

  const handleDeleteEmployee = (employee, event) => {
    event.stopPropagation() // Prevent triggering the employee profile view
    setEmployeeToDelete(employee)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      // Soft delete: change status to "Inactif" instead of removing from array
      const updatedEmployees = employees.map((emp) =>
        emp.id === employeeToDelete.id
          ? { ...emp, status: "Inactif", inactiveDate: new Date().toISOString().split("T")[0] }
          : emp,
      )
      setEmployees(updatedEmployees)
      saveEmployeesToStorage(updatedEmployees)

      // If we're viewing the deleted employee's profile, go back to list
      if (selectedEmployee && selectedEmployee.id === employeeToDelete.id) {
        setSelectedEmployee(null)
      }

      setShowDeleteConfirmation(false)
      showSuccessToast("Employé désactivé", `${employeeToDelete.name} a été désactivé avec succès.`)
      setEmployeeToDelete(null)
    }
  }

  const cancelDeleteEmployee = () => {
    setShowDeleteConfirmation(false)
    setEmployeeToDelete(null)
  }

  const handleLeaveAction = (requestId, action) => {
    const request = leaveRequests.find((req) => req.id === requestId)
    const updatedRequests = leaveRequests.map((req) =>
      req.id === requestId ? { ...req, status: action === "approve" ? "Approuvé" : "Refusé" } : req,
    )

    // Update state immediately for reactive UI
    setLeaveRequests(updatedRequests)
    saveLeaveRequestsToStorage(updatedRequests)

    if (action === "approve") {
      showSuccessToast("Demande approuvée", `La demande de congé de ${request.employeeName} a été approuvée.`)
    } else {
      showInfoToast("Demande refusée", `La demande de congé de ${request.employeeName} a été refusée.`)
    }
  }

  const [activeTab, setActiveTab] = useState("dashboard")

  // Excel report generation functions
  const generateEmployeeReport = () => {
    const employeeData = employees.map((emp) => ({
      Nom: emp.name || "",
      Poste: emp.position || "",
      Département: emp.department || "",
      Email: emp.email || "",
      Téléphone: emp.phone || "",
      "Date d'embauche": emp.startDate ? new Date(emp.startDate).toLocaleDateString("fr-FR") : "",
      "Salaire (MAD)": emp.salary || "",
      Manager: emp.manager || "",
      Statut: emp.status || "",
      "Date désactivation": emp.inactiveDate ? new Date(emp.inactiveDate).toLocaleDateString("fr-FR") : "",
    }))

    return employeeData
  }

  const generateLeaveReport = () => {
    const leaveData = leaveRequests.map((req) => ({
      Employé: req.employeeName || "",
      "Type de congé": req.type || "",
      "Date début": req.startDate ? new Date(req.startDate).toLocaleDateString("fr-FR") : "",
      "Date fin": req.endDate ? new Date(req.endDate).toLocaleDateString("fr-FR") : "",
      "Durée (jours)": req.days || 0,
      Statut: req.status || "",
      Motif: req.reason || "",
    }))

    return leaveData
  }

  const generateDepartmentReport = () => {
    const departmentData = Object.entries(departmentStats).map(([deptName, stats]) => {
      const dept = departments.find((d) => d.name === deptName)
      return {
        Département: deptName || "",
        Description: dept?.description || "N/A",
        Manager: stats.manager || "",
        "Nombre d'employés": stats.count || 0,
        "Budget de base (MAD)": stats.baseBudget || 0,
        "Coût salaires (MAD)": stats.employeeSalaries || 0,
        "Budget total (MAD)": stats.totalBudget || 0,
        "Coût moyen par employé (MAD)": stats.count > 0 ? Math.round(stats.employeeSalaries / stats.count) : 0,
      }
    })

    return departmentData
  }

  const generateBudgetReport = () => {
    const totalBudget = Object.values(departmentStats).reduce((sum, dept) => sum + dept.totalBudget, 0)

    const departmentBudgetData = Object.entries(departmentStats).map(([deptName, stats]) => {
      const budgetPercentage = totalBudget > 0 ? ((stats.totalBudget / totalBudget) * 100).toFixed(1) : 0
      return {
        Département: deptName || "",
        "Budget de base (MAD)": stats.baseBudget || 0,
        "Coût salaires (MAD)": stats.employeeSalaries || 0,
        "Budget total (MAD)": stats.totalBudget || 0,
        "Pourcentage du budget total (%)": budgetPercentage,
        "Nombre d'employés": stats.count || 0,
        "Coût moyen par employé (MAD)": stats.count > 0 ? Math.round(stats.employeeSalaries / stats.count) : 0,
      }
    })

    return departmentBudgetData
  }

  // CSV export function
  const downloadCSVReport = (data, filename) => {
    try {
      if (!data || data.length === 0) {
        showWarningToast("Aucune donnée", "Aucune donnée à exporter")
        return
      }

      const delimiter = ";" // Use semicolon for better Excel compatibility in French regions
      const headers = Object.keys(data[0])

      // Function to format a single cell
      const formatCell = (value) => {
        const strValue = String(value || "")
        if (strValue.includes(delimiter) || strValue.includes('"') || strValue.includes("\n")) {
          // Enclose in double quotes and escape existing double quotes
          return `"${strValue.replace(/"/g, '""')}"`
        }
        return strValue
      }

      // Create CSV content
      const headerRow = headers.map(formatCell).join(delimiter)
      const bodyRows = data.map((row) => headers.map((header) => formatCell(row[header])).join(delimiter)).join("\n")

      // Add BOM for UTF-8 compatibility with Excel
      const csvContent = `\uFEFF${headerRow}\n${bodyRows}`

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccessToast("Export réussi", `Le rapport "${filename}" a été exporté avec succès !`)
    } catch (error) {
      console.error("Error generating CSV file:", error)
      showErrorToast("Erreur d'export", `Erreur lors de la génération du fichier CSV: ${error.message}`)
    }
  }

  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null)

  // Department detail view
  if (selectedDepartment) {
    const departmentEmployees = employees.filter((emp) => emp.department === selectedDepartment.name)
    const activeEmployees = departmentEmployees.filter((emp) => emp.status === "Actif")
    const inactiveEmployees = departmentEmployees.filter((emp) => emp.status === "Inactif")
    const onLeaveEmployees = departmentEmployees.filter((emp) => emp.status === "En congé")
    const totalSalaries = departmentEmployees.reduce((sum, emp) => sum + Number.parseInt(emp.salary || 0), 0)

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedDepartment(null)} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 mx-4">Détails du Département</h1>
              <div className="w-16 sm:w-20"></div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Department Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedDepartment.name}</h1>
                <p className="text-gray-600 text-sm sm:text-base">{selectedDepartment.description}</p>
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{departmentEmployees.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeEmployees.length} actifs, {inactiveEmployees.length} inactifs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Base</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">
                  {Number.parseInt(selectedDepartment.budget).toLocaleString()} MAD
                </div>
                <p className="text-xs text-muted-foreground">Budget annuel alloué</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coût Salaires</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalSalaries.toLocaleString()} MAD</div>
                <p className="text-xs text-muted-foreground">Salaires annuels totaux</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Congé</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{onLeaveEmployees.length}</div>
                <p className="text-xs text-muted-foreground">Employés actuellement en congé</p>
              </CardContent>
            </Card>
          </div>

          {/* Department Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Manager</label>
                  <p className="text-sm font-semibold">{selectedDepartment.manager}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm">{selectedDepartment.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Budget Total</label>
                  <p className="text-sm font-semibold">
                    {(Number.parseInt(selectedDepartment.budget) + totalSalaries).toLocaleString()} MAD
                  </p>
                  <p className="text-xs text-gray-500">
                    Base: {Number.parseInt(selectedDepartment.budget).toLocaleString()} MAD + Salaires:{" "}
                    {totalSalaries.toLocaleString()} MAD
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Actifs</span>
                  </div>
                  <span className="font-semibold">{activeEmployees.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">En congé</span>
                  </div>
                  <span className="font-semibold">{onLeaveEmployees.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Inactifs</span>
                  </div>
                  <span className="font-semibold">{inactiveEmployees.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Salaire moyen</span>
                  <span className="font-semibold text-sm">
                    {departmentEmployees.length > 0
                      ? Math.round(totalSalaries / departmentEmployees.length).toLocaleString()
                      : "0"}{" "}
                    MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taux d'activité</span>
                  <span className="font-semibold">
                    {departmentEmployees.length > 0
                      ? Math.round((activeEmployees.length / departmentEmployees.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Budget utilisé</span>
                  <span className="font-semibold">
                    {Number.parseInt(selectedDepartment.budget) > 0
                      ? Math.round((totalSalaries / Number.parseInt(selectedDepartment.budget)) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Employés du département ({departmentEmployees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentEmployees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun employé dans ce département</p>
                  </div>
                ) : (
                  departmentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer space-y-3 sm:space-y-0"
                      onClick={() => {
                        setSelectedDepartment(null)
                        setSelectedEmployee(employee)
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-sm">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{employee.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                          <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3">
                        <div className="text-left sm:text-right">
                          <Badge className={getStatusColor(employee.status)} variant="secondary">
                            {employee.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{employee.salary} MAD/an</p>
                        </div>
                        {employee.status === "Actif" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteEmployee(employee, e)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Leave detail view
  if (selectedLeaveRequest) {
    const employee = employees.find((emp) => emp.name === selectedLeaveRequest.employeeName)
    const leaveBalance = employee ? calculateLeaveBalance(employee) : null

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedLeaveRequest(null)} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 mx-4">
                Détails de la demande de congé
              </h1>
              <div className="w-16 sm:w-20"></div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{selectedLeaveRequest.type}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{selectedLeaveRequest.employeeName}</CardDescription>
                <Badge className={getLeaveStatusColor(selectedLeaveRequest.status)}>
                  {selectedLeaveRequest.status}
                </Badge>
              </CardHeader>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Informations de la demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employé</label>
                    <p className="text-sm font-semibold">{selectedLeaveRequest.employeeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de congé</label>
                    <p className="text-sm">{selectedLeaveRequest.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de début</label>
                    <p className="text-sm">{new Date(selectedLeaveRequest.startDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de fin</label>
                    <p className="text-sm">{new Date(selectedLeaveRequest.endDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durée</label>
                    <p className="text-sm font-semibold">{selectedLeaveRequest.days} jour(s)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <Badge className={getLeaveStatusColor(selectedLeaveRequest.status)}>
                      {selectedLeaveRequest.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Motif</label>
                    <p className="text-sm">{selectedLeaveRequest.reason || "Aucun motif spécifié"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {employee && leaveBalance && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations employé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{employee.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                      <p className="text-sm text-gray-500 truncate">{employee.department}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLeaveRequest(null)
                      setSelectedEmployee(employee)
                    }}
                    className="w-full"
                  >
                    Voir le profil complet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Solde de congés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Congés acquis</span>
                    <span className="text-sm font-medium">{leaveBalance.earned} jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Congés utilisés</span>
                    <span className="text-sm font-medium text-red-600">{leaveBalance.used} jours</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-semibold">Solde disponible</span>
                    <span className="text-sm font-bold text-green-600">{leaveBalance.available} jours</span>
                  </div>
                  {selectedLeaveRequest.status === "En attente" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-yellow-800">
                        Cette demande est en attente d'approbation.
                        {leaveBalance.available >= selectedLeaveRequest.days
                          ? " Le solde est suffisant."
                          : " ⚠️ Le solde est insuffisant !"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedLeaveRequest.status === "En attente" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLeaveAction(selectedLeaveRequest.id, "reject")
                      setSelectedLeaveRequest({ ...selectedLeaveRequest, status: "Refusé" })
                    }}
                    className="flex-1"
                  >
                    Refuser la demande
                  </Button>
                  <Button
                    onClick={() => {
                      handleLeaveAction(selectedLeaveRequest.id, "approve")
                      setSelectedLeaveRequest({ ...selectedLeaveRequest, status: "Approuvé" })
                    }}
                    className="flex-1"
                  >
                    Approuver la demande
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (selectedEmployee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedEmployee(null)} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 mx-4">Profil Employé</h1>
              <div className="flex items-center space-x-2">
                {!isEditingEmployee ? (
                  <Button
                    onClick={() => {
                      setIsEditingEmployee(true)
                      setEditedEmployee({ ...selectedEmployee })
                    }}
                    size="sm"
                  >
                    <span className="hidden sm:inline">Modifier</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingEmployee(false)
                        setEditedEmployee(null)
                      }}
                      size="sm"
                    >
                      <span className="hidden sm:inline">Annuler</span>
                      <X className="h-4 w-4 sm:hidden" />
                    </Button>
                    <Button
                      onClick={() => {
                        // Update the employee in the employees array
                        const updatedEmployees = employees.map((emp) =>
                          emp.id === editedEmployee.id ? editedEmployee : emp,
                        )
                        setEmployees(updatedEmployees)
                        saveEmployeesToStorage(updatedEmployees)
                        setSelectedEmployee(editedEmployee)
                        setIsEditingEmployee(false)
                        setEditedEmployee(null)
                        showSuccessToast(
                          "Profil mis à jour",
                          "Les informations de l'employé ont été mises à jour avec succès.",
                        )
                      }}
                      size="sm"
                    >
                      <span className="hidden sm:inline">Sauvegarder</span>
                      <span className="sm:hidden">Save</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-800 font-semibold">
                    {getInitials(selectedEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg sm:text-xl">{selectedEmployee.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{selectedEmployee.position}</CardDescription>
                <Badge className={getStatusColor(selectedEmployee.status)}>{selectedEmployee.status}</Badge>
                {selectedEmployee.status === "Inactif" && selectedEmployee.inactiveDate && (
                  <p className="text-xs text-red-600 mt-1">
                    Désactivé le {new Date(selectedEmployee.inactiveDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </CardHeader>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingEmployee ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-sm break-all">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="text-sm">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Département</label>
                      <p className="text-sm">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Manager</label>
                      <p className="text-sm">{selectedEmployee.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date d'embauche</label>
                      <p className="text-sm">{new Date(selectedEmployee.startDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Salaire</label>
                      <p className="text-sm">{selectedEmployee.salary} MAD/an</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nom complet</label>
                      <Input
                        value={editedEmployee.name}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Poste</label>
                      <Input
                        value={editedEmployee.position}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={editedEmployee.email}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Téléphone</label>
                      <Input
                        value={editedEmployee.phone}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Département</label>
                      <select
                        value={editedEmployee.department}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, department: e.target.value })}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">Sélectionner un département</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Manager</label>
                      <Input
                        value={editedEmployee.manager}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, manager: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date d'embauche</label>
                      <Input
                        type="date"
                        value={editedEmployee.startDate}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Salaire annuel (MAD)</label>
                      <Input
                        type="number"
                        value={editedEmployee.salary}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, salary: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Congés</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const leaveBalance = calculateLeaveBalance(selectedEmployee)
                  const isOnLeave = isEmployeeOnLeave(selectedEmployee.name)
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ancienneté</span>
                        <span className="text-sm font-medium">{leaveBalance.monthsWorked} mois</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Congés acquis</span>
                        <span className="text-sm font-medium">{leaveBalance.earned} jours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Congés utilisés</span>
                        <span className="text-sm font-medium text-red-600">{leaveBalance.used} jours</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-semibold">Solde disponible</span>
                        <span className="text-sm font-bold text-green-600">{leaveBalance.available} jours</span>
                      </div>
                      {isOnLeave && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <p className="text-xs text-yellow-800 font-medium">🏖️ Actuellement en congé</p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        <p>• 1,5 jour acquis par mois travaillé</p>
                        <p>• Calcul basé sur la date d'embauche</p>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Dernière évaluation</span>
                    <span className="text-sm font-medium">Décembre 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Note globale</span>
                    <span className="text-sm font-medium">4.2/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Objectifs atteints</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">SIRH - Gestion RH</span>
                <span className="sm:hidden">SIRH</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex bg-transparent"
                onClick={() => setShowNewDepartmentForm(true)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Nouveau département
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex bg-transparent"
                onClick={() => setShowNewLeaveForm(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Nouvelle demande de congé</span>
                <span className="lg:hidden">Congé</span>
              </Button>
              <Button size="sm" onClick={() => setShowNewEmployeeForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nouvel employé</span>
                <span className="sm:hidden">Employé</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mt-4 pb-4 border-t pt-4 md:hidden">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewDepartmentForm(true)
                    setShowMobileMenu(false)
                  }}
                  className="justify-start"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Nouveau département
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewLeaveForm(true)
                    setShowMobileMenu(false)
                  }}
                  className="justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouvelle demande de congé
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal Nouvel Employé */}
      {showNewEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Ajouter un nouvel employé</CardTitle>
                  <CardDescription className="text-sm">Remplissez les informations de l'employé</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewEmployeeForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nom complet *</label>
                  <Input
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Ex: Fatima Zahra Benali"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Poste *</label>
                  <Input
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Ex: Développeuse Senior"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Département</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Manager</label>
                  <Input
                    value={newEmployee.manager}
                    onChange={(e) => setNewEmployee({ ...newEmployee, manager: e.target.value })}
                    placeholder="Ex: Ahmed Alami"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Ex: fatima.benali@company.ma"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Téléphone</label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="Ex: +212 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date d'embauche</label>
                  <Input
                    type="date"
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Salaire annuel (MAD)</label>
                  <Input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                    placeholder="Ex: 65000"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewEmployeeForm(false)} className="order-2 sm:order-1">
                  Annuler
                </Button>
                <Button onClick={handleAddEmployee} className="order-1 sm:order-2">
                  Ajouter l'employé
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Nouveau Département */}
      {showNewDepartmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Ajouter un nouveau département</CardTitle>
                  <CardDescription className="text-sm">
                    Créez un nouveau département dans votre organisation
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewDepartmentForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nom du département *</label>
                <Input
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Ex: Développement"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <Input
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  placeholder="Ex: Équipe de développement logiciel"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Manager</label>
                <Input
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment({ ...newDepartment, manager: e.target.value })}
                  placeholder="Ex: Ahmed Alami"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Budget annuel (MAD)</label>
                <Input
                  type="number"
                  value={newDepartment.budget}
                  onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                  placeholder="Ex: 500000"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewDepartmentForm(false)}
                  className="order-2 sm:order-1"
                >
                  Annuler
                </Button>
                <Button onClick={handleAddDepartment} className="order-1 sm:order-2">
                  Créer le département
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Nouvelle Demande de Congé */}
      {showNewLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Nouvelle demande de congé</CardTitle>
                  <CardDescription className="text-sm">Créez une nouvelle demande de congé</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewLeaveForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Employé *</label>
                <select
                  value={newLeaveRequest.employeeName}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, employeeName: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Sélectionner un employé</option>
                  {(() => {
                    const availableEmployees = employees.filter((emp) => {
                      // Only show active employees
                      if (emp.status !== "Actif") return false

                      // Check if employee is currently on approved leave
                      const currentDate = new Date()
                      const hasActiveLeave = leaveRequests.some((req) => {
                        if (req.employeeName !== emp.name || req.status !== "Approuvé") return false

                        const startDate = new Date(req.startDate)
                        const endDate = new Date(req.endDate)
                        return currentDate >= startDate && currentDate <= endDate
                      })

                      // Only show employees who are NOT currently on leave
                      return !hasActiveLeave
                    })

                    if (availableEmployees.length === 0) {
                      return <option disabled>Aucun employé disponible</option>
                    }

                    return availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))
                  })()}
                </select>
              </div>
              {newLeaveRequest.employeeName &&
                (() => {
                  const employee = employees.find((emp) => emp.name === newLeaveRequest.employeeName)
                  if (employee) {
                    const leaveBalance = calculateLeaveBalance(employee)
                    const isOnLeave = isEmployeeOnLeave(employee.name)
                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <span>Solde disponible:</span>
                          <span className="font-semibold text-blue-800">{leaveBalance.available} jours</span>
                        </div>
                        {isOnLeave && (
                          <p className="text-xs text-red-600 mt-1">⚠️ Cet employé est actuellement en congé</p>
                        )}
                      </div>
                    )
                  }
                  return null
                })()}
              <div>
                <label className="text-sm font-medium mb-1 block">Type de congé *</label>
                <select
                  value={newLeaveRequest.type}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, type: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Congés payés">Congés payés</option>
                  <option value="RTT">RTT</option>
                  <option value="Congé maladie">Congé maladie</option>
                  <option value="Congé maternité">Congé maternité</option>
                  <option value="Congé paternité">Congé paternité</option>
                  <option value="Congé sans solde">Congé sans solde</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date de début *</label>
                  <Input
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date de fin *</label>
                  <Input
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Motif</label>
                <Input
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, reason: e.target.value })}
                  placeholder="Ex: Vacances d'été"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewLeaveForm(false)} className="order-2 sm:order-1">
                  Annuler
                </Button>
                <Button onClick={handleAddLeaveRequest} className="order-1 sm:order-2">
                  Créer la demande
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600 text-lg">Confirmer la suppression</CardTitle>
              <CardDescription className="text-sm">Êtes-vous sûr de vouloir supprimer cet employé ?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {employeeToDelete && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-sm">
                        {getInitials(employeeToDelete.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{employeeToDelete.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{employeeToDelete.position}</p>
                      <p className="text-sm text-gray-500 truncate">{employeeToDelete.department}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> L'employé sera marqué comme "Inactif" de façon permanente et ses données seront
                  conservées pour l'historique.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button variant="outline" onClick={cancelDeleteEmployee} className="order-2 sm:order-1 bg-transparent">
                  Annuler
                </Button>
                <Button variant="destructive" onClick={confirmDeleteEmployee} className="order-1 sm:order-2">
                  Confirmer la suppression
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger
              value="dashboard"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Tableau de bord</span>
                <span className="sm:hidden">Dashboard</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="employees"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Employés</span>
            </TabsTrigger>
            <TabsTrigger
              value="leaves"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Congés</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Rapports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards - Maintenant réactifs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Employés</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{dashboardStats.totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">Employés actifs</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Départements</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{dashboardStats.totalDepartments}</div>
                  <p className="text-xs text-muted-foreground">Départements actifs</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Congés en attente</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{dashboardStats.pendingLeaves}</div>
                  <p className="text-xs text-muted-foreground">À traiter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Budget Total</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{dashboardStats.totalBudget.toLocaleString()} MAD</div>
                  <p className="text-xs text-muted-foreground">Budget annuel</p>
                </CardContent>
              </Card>
            </div>

            {/* Departments Overview - Maintenant réactif et cliquable */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Vue d'ensemble des départements</CardTitle>
                <CardDescription className="text-sm">Cliquez sur un département pour voir les détails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dynamicDepartments.map((dept, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{dept.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{dept.employees} employés</p>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <p>
                          Budget total: <span className="font-medium">{dept.budget}</span>
                        </p>
                        <p className="text-xs text-gray-500">• Budget base: {dept.baseBudget}</p>
                        <p className="text-xs text-gray-500">• Salaires: {dept.salariesBudget}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">Manager: {dept.manager}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            {/* Search and Filter Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex-1 sm:flex-none ${hasActiveFilters ? "bg-blue-50 border-blue-200" : ""}`}
                    size="sm"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-red-600 hover:text-red-700"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Effacer</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Département</label>
                        <select
                          value={filters.department}
                          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value="">Tous les départements</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Statut</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value="">Tous les statuts</option>
                          {uniqueStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Poste</label>
                        <select
                          value={filters.position}
                          onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value="">Tous les postes</option>
                          {uniquePositions.map((position) => (
                            <option key={position} value={position}>
                              {position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Liste des employés ({filteredEmployees.length}
                  {hasActiveFilters && ` sur ${employees.length}`})
                </CardTitle>
                {hasActiveFilters && (
                  <CardDescription className="text-sm">
                    Filtres actifs: {searchTerm && `Recherche: "${searchTerm}"`}
                    {filters.department && ` • Département: ${filters.department}`}
                    {filters.status && ` • Statut: ${filters.status}`}
                    {filters.position && ` • Poste: ${filters.position}`}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">Aucun employé trouvé avec ces critères</p>
                      {hasActiveFilters && (
                        <Button variant="outline" onClick={clearFilters} className="mt-2 bg-transparent" size="sm">
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer space-y-3 sm:space-y-0"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-sm">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{employee.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                            <p className="text-sm text-gray-500 truncate">{employee.department}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                          <div className="text-left sm:text-right">
                            <Badge className={getStatusColor(employee.status)} variant="secondary">
                              {employee.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1 truncate">{employee.email}</p>
                            {(() => {
                              const leaveBalance = calculateLeaveBalance(employee)
                              const isOnLeave = isEmployeeOnLeave(employee.name)
                              return (
                                <p className="text-xs text-gray-500">
                                  {isOnLeave ? "🏖️ En congé" : `${leaveBalance.available} jours dispo`}
                                </p>
                              )
                            })()}
                          </div>
                          {employee.status === "Actif" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteEmployee(employee, e)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Gestion des congés</CardTitle>
                <CardDescription className="text-sm">Gérez les demandes de congés de vos employés</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="demandes" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="demandes" className="text-xs sm:text-sm">
                      Demandes ({leaveRequests.filter((req) => req.status === "En attente").length})
                    </TabsTrigger>
                    <TabsTrigger value="approuve" className="text-xs sm:text-sm">
                      Approuvé ({leaveRequests.filter((req) => req.status === "Approuvé").length})
                    </TabsTrigger>
                    <TabsTrigger value="en-conge" className="text-xs sm:text-sm">
                      En congé ({(() => {
                        const currentDate = new Date()
                        return leaveRequests.filter((req) => {
                          if (req.status !== "Approuvé") return false
                          const startDate = new Date(req.startDate)
                          const endDate = new Date(req.endDate)
                          endDate.setHours(23, 59, 59, 999) // Make it inclusive of the whole day
                          return currentDate >= startDate && currentDate <= endDate
                        }).length
                      })()})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="demandes" className="space-y-4">
                    <div className="space-y-4">
                      {leaveRequests.filter((req) => req.status === "En attente").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm sm:text-base">Aucune demande en attente</p>
                        </div>
                      ) : (
                        leaveRequests
                          .filter((req) => req.status === "En attente")
                          .map((request) => (
                            <div
                              key={request.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer space-y-3 sm:space-y-0"
                              onClick={() => setSelectedLeaveRequest(request)}
                            >
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{request.employeeName}</h3>
                                <p className="text-sm text-gray-600">{request.type}</p>
                                <p className="text-sm text-gray-500">
                                  Du {new Date(request.startDate).toLocaleDateString("fr-FR")} au{" "}
                                  {new Date(request.endDate).toLocaleDateString("fr-FR")}
                                </p>
                                <p className="text-sm text-gray-500 truncate">{request.reason}</p>
                              </div>
                              <div className="text-left sm:text-right">
                                <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                                  En attente
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">{request.days} jour(s)</p>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleLeaveAction(request.id, "reject")
                                    }}
                                  >
                                    Refuser
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleLeaveAction(request.id, "approve")
                                    }}
                                  >
                                    Approuver
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="approuve" className="space-y-4">
                    <Card className="bg-gray-50/50">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Date de début</label>
                            <Input
                              type="date"
                              value={leaveDateFilter.startDate}
                              onChange={(e) => setLeaveDateFilter({ ...leaveDateFilter, startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Date de fin</label>
                            <Input
                              type="date"
                              value={leaveDateFilter.endDate}
                              onChange={(e) => setLeaveDateFilter({ ...leaveDateFilter, endDate: e.target.value })}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setLeaveDateFilter({ startDate: "", endDate: "" })}
                              className="w-full"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Effacer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {(() => {
                      const approvedLeaves = leaveRequests.filter((req) => {
                        if (req.status !== "Approuvé") return false

                        if (leaveDateFilter.startDate && leaveDateFilter.endDate) {
                          const reqStart = new Date(req.startDate)
                          const reqEnd = new Date(req.endDate)
                          const filterStart = new Date(leaveDateFilter.startDate)
                          const filterEnd = new Date(leaveDateFilter.endDate)
                          // Check for overlap
                          return reqStart <= filterEnd && reqEnd >= filterStart
                        }
                        return true
                      })

                      if (approvedLeaves.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">
                              Aucun congé approuvé
                              {leaveDateFilter.startDate && " pour cette période"}
                            </p>
                          </div>
                        )
                      }

                      return approvedLeaves.map((request) => {
                        const currentDate = new Date()
                        const startDate = new Date(request.startDate)
                        const endDate = new Date(request.endDate)
                        const isCurrentlyOnLeave = currentDate >= startDate && currentDate <= endDate
                        const isPastLeave = currentDate > endDate
                        const isFutureLeave = currentDate < startDate

                        return (
                          <div
                            key={request.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer space-y-3 sm:space-y-0"
                            onClick={() => setSelectedLeaveRequest(request)}
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{request.employeeName}</h3>
                              <p className="text-sm text-gray-600">{request.type}</p>
                              <p className="text-sm text-gray-500">
                                Du {new Date(request.startDate).toLocaleDateString("fr-FR")} au{" "}
                                {new Date(request.endDate).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{request.reason}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="flex flex-col space-y-1">
                                <Badge className="bg-green-100 text-green-800" variant="secondary">
                                  Approuvé
                                </Badge>
                                {isCurrentlyOnLeave && (
                                  <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                                    🏖️ En cours
                                  </Badge>
                                )}
                                {isPastLeave && (
                                  <Badge className="bg-gray-100 text-gray-800" variant="secondary">
                                    Terminé
                                  </Badge>
                                )}
                                {isFutureLeave && (
                                  <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                                    À venir
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{request.days} jour(s)</p>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </TabsContent>

                  <TabsContent value="en-conge" className="space-y-4">
                    <div className="space-y-4">
                      {(() => {
                        const currentDate = new Date()
                        const currentLeaves = leaveRequests.filter((req) => {
                          if (req.status !== "Approuvé") return false
                          const startDate = new Date(req.startDate)
                          const endDate = new Date(req.endDate)
                          endDate.setHours(23, 59, 59, 999) // Make it inclusive of the whole day
                          return currentDate >= startDate && currentDate <= endDate
                        })

                        if (currentLeaves.length === 0) {
                          return (
                            <div className="text-center py-8 text-gray-500">
                              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="text-sm sm:text-base">Aucun employé actuellement en congé</p>
                            </div>
                          )
                        }

                        return currentLeaves.map((request) => {
                          const employee = employees.find((emp) => emp.name === request.employeeName)
                          const endDate = new Date(request.endDate)
                          const daysRemaining = Math.ceil(
                            (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
                          )

                          return (
                            <div
                              key={request.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer space-y-3 sm:space-y-0 bg-blue-50 border-blue-200"
                              onClick={() => setSelectedLeaveRequest(request)}
                            >
                              <div className="flex items-center space-x-4">
                                {employee && (
                                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-sm">
                                      {getInitials(employee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">
                                    {request.employeeName}
                                  </h3>
                                  <p className="text-sm text-gray-600">{request.type}</p>
                                  <p className="text-sm text-gray-500">
                                    Du {new Date(request.startDate).toLocaleDateString("fr-FR")} au{" "}
                                    {new Date(request.endDate).toLocaleDateString("fr-FR")}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">{request.reason}</p>
                                  {employee && (
                                    <p className="text-xs text-gray-500">
                                      {employee.department} • {employee.position}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                                  🏖️ En congé
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">{request.days} jour(s) total</p>
                                <p className="text-xs text-blue-600 font-medium">
                                  {daysRemaining > 0 ? `${daysRemaining} jour(s) restant(s)` : "Dernier jour"}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Generation Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Générer des rapports</CardTitle>
                  <CardDescription className="text-sm">
                    Sélectionnez le type de rapport à générer (format CSV)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 flex-col space-y-2 bg-transparent hover:bg-blue-50 relative text-xs sm:text-sm"
                      onClick={() => {
                        const reportData = generateEmployeeReport()
                        downloadCSVReport(reportData, "rapport-employes.csv")
                      }}
                    >
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Exporter
                        </Badge>
                      </div>
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-center">Rapport des employés</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 flex-col space-y-2 bg-transparent hover:bg-green-50 relative text-xs sm:text-sm"
                      onClick={() => {
                        const reportData = generateLeaveReport()
                        downloadCSVReport(reportData, "rapport-conges.csv")
                      }}
                    >
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Exporter
                        </Badge>
                      </div>
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-center">Rapport des congés</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 flex-col space-y-2 bg-transparent hover:bg-purple-50 relative text-xs sm:text-sm"
                      onClick={() => {
                        const reportData = generateDepartmentReport()
                        downloadCSVReport(reportData, "rapport-departements.csv")
                      }}
                    >
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Exporter
                        </Badge>
                      </div>
                      <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-center">Rapport départements</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16 sm:h-20 flex-col space-y-2 bg-transparent hover:bg-orange-50 relative text-xs sm:text-sm"
                      onClick={() => {
                        const reportData = generateBudgetReport()
                        downloadCSVReport(reportData, "rapport-budget.csv")
                      }}
                    >
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Exporter
                        </Badge>
                      </div>
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-center">Rapport budgétaire</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Statistiques rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total employés</span>
                      <span className="font-semibold">{employees.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Employés actifs</span>
                      <span className="font-semibold text-green-600">
                        {employees.filter((emp) => emp.status === "Actif").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">En congé</span>
                      <span className="font-semibold text-yellow-600">
                        {employees.filter((emp) => emp.status === "En congé").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inactifs</span>
                      <span className="font-semibold text-red-600">
                        {employees.filter((emp) => emp.status === "Inactif").length}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Congés en attente</span>
                      <span className="font-semibold text-orange-600">
                        {leaveRequests.filter((req) => req.status === "En attente").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget total</span>
                      <span className="font-semibold text-xs sm:text-sm">
                        {Object.values(departmentStats)
                          .reduce((sum, dept) => sum + dept.totalBudget, 0)
                          .toLocaleString()}{" "}
                        MAD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Répartition par département</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chart Container */}
                    <div className="relative h-64 w-full">
                      <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Chart Background */}
                        <rect x="0" y="0" width="400" height="300" fill="#f8fafc" rx="8" />

                        {/* Chart Title */}
                        <text x="200" y="25" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                          Employés par département
                        </text>

                        {/* Chart Data */}
                        {(() => {
                          const totalEmployees = employees.length
                          const maxEmployees = Math.max(...Object.values(departmentStats).map((dept) => dept.count))
                          const chartHeight = 200
                          const chartWidth = 300
                          const barWidth = chartWidth / Object.keys(departmentStats).length - 20
                          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

                          return Object.entries(departmentStats).map(([deptName, stats], index) => {
                            const barHeight = maxEmployees > 0 ? (stats.count / maxEmployees) * chartHeight : 0
                            const x = 50 + index * (barWidth + 20)
                            const y = 250 - barHeight
                            const color = colors[index % colors.length]

                            return (
                              <g key={deptName}>
                                {/* Bar */}
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  fill={color}
                                  rx="4"
                                  className="opacity-80 hover:opacity-100 transition-opacity"
                                />

                                {/* Value Label */}
                                <text
                                  x={x + barWidth / 2}
                                  y={y - 5}
                                  textAnchor="middle"
                                  className="text-xs font-medium fill-gray-700"
                                >
                                  {stats.count}
                                </text>

                                {/* Department Label */}
                                <text
                                  x={x + barWidth / 2}
                                  y={270}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600"
                                  transform={`rotate(-45, ${x + barWidth / 2}, 270)`}
                                >
                                  {deptName}
                                </text>
                              </g>
                            )
                          })
                        })()}

                        {/* Y-axis */}
                        <line x1="40" y1="50" x2="40" y2="250" stroke="#e5e7eb" strokeWidth="2" />

                        {/* X-axis */}
                        <line x1="40" y1="250" x2="360" y2="250" stroke="#e5e7eb" strokeWidth="2" />

                        {/* Y-axis labels */}
                        {(() => {
                          const maxEmployees = Math.max(...Object.values(departmentStats).map((dept) => dept.count))
                          const steps = 5
                          const stepValue = Math.ceil(maxEmployees / steps)

                          return Array.from({ length: steps + 1 }, (_, i) => {
                            const value = i * stepValue
                            const y = 250 - (i * 200) / steps

                            return (
                              <g key={i}>
                                <text x="35" y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
                                  {value}
                                </text>
                                <line x1="38" y1={y} x2="42" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                              </g>
                            )
                          })
                        })()}
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {Object.entries(departmentStats).map(([deptName, stats], index) => {
                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
                        const color = colors[index % colors.length]

                        return (
                          <div key={deptName} className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            ></div>
                            <span className="text-sm truncate">{deptName}</span>
                            <span className="text-sm font-medium ml-auto">{stats.count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Analyse budgétaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(departmentStats).map(([deptName, stats]) => {
                      const totalBudget = Object.values(departmentStats).reduce(
                        (sum, dept) => sum + dept.totalBudget,
                        0,
                      )
                      const percentage = totalBudget > 0 ? (stats.totalBudget / totalBudget) * 100 : 0

                      return (
                        <div key={deptName} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{deptName}</span>
                            <span className="text-sm text-gray-600">
                              {stats.totalBudget.toLocaleString()} MAD ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {stats.count} employé(s) • Salaire moyen:{" "}
                            {stats.count > 0 ? Math.round(stats.employeeSalaries / stats.count).toLocaleString() : 0}{" "}
                            MAD
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
