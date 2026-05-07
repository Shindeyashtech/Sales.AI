// SuperAdminPage.jsx
// Beautiful Super Admin Dashboard
// Shows platform statistics with charts

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie, Legend
} from 'recharts'

function SuperAdminPage() {

  const navigate          = useNavigate()
  const user              = useAuthStore(state => state.user)
  const token             = useAuthStore(state => state.token)
  const [stats, setStats] = useState(null)
  const [orgs,  setOrgs]  = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const headers = { 'Authorization': `Bearer ${token}` }

      const [statsRes, orgsRes, usersRes] = await Promise.all([
        fetch('http://import.meta.env.VITE_API_URL/api/v1/superadmin/stats',         { headers }),
        fetch('http://import.meta.env.VITE_API_URL/api/v1/superadmin/organizations', { headers }),
        fetch('http://import.meta.env.VITE_API_URL/api/v1/superadmin/users',         { headers })
      ])

      const statsData = await statsRes.json()
      const orgsData  = await orgsRes.json()
      const usersData = await usersRes.json()

      setStats(statsData)
      setOrgs(orgsData.organizations   || [])
      setUsers(usersData.users         || [])

    } catch (err) {
      console.error('Failed:', err)
    } finally {
      setLoading(false)
    }
  }
  async function deleteOrganization(orgId, orgName) {
  if (!window.confirm(
    `Delete "${orgName}" and ALL its data? This cannot be undone!`
  )) return

  try {
    const response = await fetch(
      `http://import.meta.env.VITE_API_URL/api/v1/superadmin/organization/${orgId}`,
      {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )

    if (response.ok) {
      alert('Organization deleted!')
      fetchData()
    }
  } catch (err) {
    alert('Delete failed!')
  }
}

async function deleteUser(userId, userName) {
  if (!window.confirm(
    `Delete user "${userName}"?`
  )) return

  try {
    const response = await fetch(
      `http://import.meta.env.VITE_API_URL/api/v1/superadmin/user/${userId}`,
      {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )

    if (response.ok) {
      alert('User deleted!')
      fetchData()
    }
  } catch (err) {
    alert('Delete failed!')
  }
}

  // Chart data
  const orgBarData = orgs
    .filter(o => o.plan !== 'super')
    .map(org => ({
      name:    org.name.length > 12
        ? org.name.substring(0, 12) + '...'
        : org.name,
      members: org.members,
      calls:   org.calls
    }))

  const roleData = [
    {
      name:  'Admins',
      value: users.filter(u => u.role === 'admin').length,
      color: '#4361ee'
    },
    {
      name:  'Employees',
      value: users.filter(u => u.role === 'employee').length,
      color: '#16a34a'
    },
    {
      name:  'Super Admin',
      value: users.filter(u => u.role === 'superadmin').length,
      color: '#7209b7'
    },
  ].filter(d => d.value > 0)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#666', marginTop: '16px' }}>
          Loading platform data...
        </p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{
              color: '#1a1a2e',
              fontSize: '26px',
              fontWeight: '800'
            }}>
              ⚡ Platform Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Sales.AI — Site Owner View
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              backgroundColor: '#7209b7',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>

          {[
            {
              label: 'ORGANIZATIONS',
              value: stats?.total_organizations || 0,
              color: '#4361ee',
              bg:    '#f0f4ff',
              icon:  '🏢',
              sub:   'registered companies'
            },
            {
              label: 'TOTAL USERS',
              value: stats?.total_users || 0,
              color: '#7209b7',
              bg:    '#fdf4ff',
              icon:  '👥',
              sub:   'across all orgs'
            },
            {
              label: 'CALLS ANALYZED',
              value: stats?.total_calls || 0,
              color: '#16a34a',
              bg:    '#f0fff4',
              icon:  '🎙️',
              sub:   'total AI analyses'
            },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: card.bg,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px' }}>{card.icon}</p>
              <p style={{
                color: '#666',
                fontSize: '12px',
                marginTop: '8px'
              }}>
                {card.label}
              </p>
              <p style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: card.color,
                lineHeight: 1.1
              }}>
                {card.value}
              </p>
              <p style={{ color: '#999', fontSize: '13px' }}>
                {card.sub}
              </p>
            </div>
          ))}

        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {[
            { key: 'overview',       label: '📊 Overview'       },
            { key: 'organizations',  label: '🏢 Organizations'  },
            { key: 'users',          label: '👥 Users'          },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                backgroundColor: activeTab === tab.key
                  ? '#7209b7' : 'white',
                color: activeTab === tab.key
                  ? 'white' : '#666',
                padding: '10px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>

            {/* Members per org bar chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#1a1a2e',
                marginBottom: '20px'
              }}>
                👥 Members Per Organization
              </h3>
              {orgBarData.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>
                  No organizations yet!
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={orgBarData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="members"
                      fill="#4361ee"
                      radius={[6,6,0,0]}
                      name="Members"
                    />
                    <Bar
                      dataKey="calls"
                      fill="#16a34a"
                      radius={[6,6,0,0]}
                      name="Calls"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User Roles Pie Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#1a1a2e',
                marginBottom: '20px'
              }}>
                🥧 User Role Distribution
              </h3>
              {roleData.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>
                  No users yet!
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#1a1a2e',
              marginBottom: '20px'
            }}>
              🏢 All Organizations ({orgs.length})
            </h3>

            {orgs.length === 0 ? (
              <p style={{
                color: '#999',
                textAlign: 'center',
                padding: '40px'
              }}>
                No organizations registered yet!
              </p>
            ) : (
              orgs.map((org) => (
                <div key={org.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>

                    {/* Org Info */}
                    <div>
                      <p style={{
                        fontWeight: '700',
                        color: '#1a1a2e',
                        fontSize: '16px'
                      }}>
                        🏢 {org.name}
                      </p>
                      <p style={{
                        color: '#4361ee',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginTop: '4px'
                      }}>
                        Code: {org.org_code}
                      </p>
                      <p style={{
                        color: '#666',
                        fontSize: '13px'
                      }}>
                        Admin: {org.admin_email}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: 'flex',
                      gap: '32px',
                      alignItems: 'center'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{
                          color: '#666',
                          fontSize: '11px'
                        }}>
                          MEMBERS
                        </p>
                        <p style={{
                          fontWeight: 'bold',
                          fontSize: '28px',
                          color: '#4361ee'
                        }}>
                          {org.members}
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{
                          color: '#666',
                          fontSize: '11px'
                        }}>
                          CALLS
                        </p>
                        <p style={{
                          fontWeight: 'bold',
                          fontSize: '28px',
                          color: '#16a34a'
                        }}>
                          {org.calls}
                        </p>
                      </div>

                      {/* Plan Badge */}
                      <div style={{
                        backgroundColor:
                          org.plan === 'super' ? '#7209b7' :
                          org.plan === 'paid'  ? '#16a34a' : '#f0f2f5',
                        color:
                          org.plan === 'free' ? '#334155' : 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>

                        {org.plan}
                      </div>
                      {/* Delete Button */}
{org.plan !== 'super' && (
  <button
    onClick={() => deleteOrganization(org.id, org.name)}
    style={{
      backgroundColor: '#fff0f0',
      color: '#dc2626',
      padding: '8px 16px',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600'
    }}
  >
    🗑️ Delete
  </button>
)}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#1a1a2e',
              marginBottom: '20px'
            }}>
              👥 All Users ({users.length})
            </h3>

            {users.length === 0 ? (
              <p style={{
                color: '#999',
                textAlign: 'center',
                padding: '40px'
              }}>
                No users yet!
              </p>
            ) : (
              users.map((u) => (
                <div key={u.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  marginBottom: '10px'
                }}>

                  {/* User Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}>
                    <div style={{
                      backgroundColor:
                        u.role === 'superadmin' ? '#7209b7' :
                        u.role === 'admin'      ? '#4361ee' : '#16a34a',
                      color: 'white',
                      borderRadius: '50%',
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '600',
                        color: '#1a1a2e'
                      }}>
                        {u.name}
                      </p>
                      <p style={{
                        color: '#666',
                        fontSize: '13px'
                      }}>
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div style={{
                    backgroundColor:
                      u.role === 'superadmin' ? '#7209b7' :
                      u.role === 'admin'      ? '#4361ee' : '#f0f2f5',
                    color:
                      u.role === 'employee' ? '#334155' : 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {u.role}
                  </div>
                  {/* Delete Button */}
{u.role !== 'superadmin' && (
  <button
    onClick={() => deleteUser(u.id, u.name)}
    style={{
      backgroundColor: '#fff0f0',
      color: '#dc2626',
      padding: '6px 14px',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600'
    }}
  >
    🗑️ Delete
  </button>
)}

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default SuperAdminPage