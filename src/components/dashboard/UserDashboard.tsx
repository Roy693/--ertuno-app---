import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserLeads, useLeadCreation } from '../../hooks/useFirestore';
import { useLocation } from '../../hooks/useLocation';
import Button from '../ui/Button';
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import { colors, spacing, typography } from '../../styles/theme';

interface UserDashboardProps {
  onCreateLead?: (leadData: any) => void;
  onMessageProvider?: (providerId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onCreateLead,
  onMessageProvider
}) => {
  const { user, userDoc } = useAuth();
  const { data: userLeads, loading: leadsLoading } = useUserLeads();
  const { createLead, loading: createLoading } = useLeadCreation();
  const { location, locationData } = useLocation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    title: '',
    category: '',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    budget: { min: 0, max: 0 }
  });

  const categories = [
    'Casa & Giardino', 'Bellezza & Benessere', 'Trasporti', 
    'Tecnologia', 'Animali', 'Eventi', 'Pulizie', 'Riparazioni'
  ];

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !leadForm.title || !leadForm.category || !leadForm.description) {
      return;
    }

    try {
      const leadData = {
        userId: user.uid,
        title: leadForm.title,
        category: leadForm.category,
        description: leadForm.description,
        location: locationData?.city || 'Comiso',
        urgency: leadForm.urgency
      };

      const result = await createLead(
        leadData.userId,
        leadData.category,
        leadData.title,
        leadData.description,
        leadData.location,
        leadData.urgency
      );

      if (result) {
        setLeadForm({
          title: '',
          category: '',
          description: '',
          urgency: 'medium',
          budget: { min: 0, max: 0 }
        });
        setShowCreateForm(false);
        onCreateLead?.(leadData);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aperto';
      case 'in_progress': return 'In Corso';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Annullato';
      default: return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return colors.error[500];
      case 'medium': return colors.warning[500];
      case 'low': return colors.success[500];
      default: return colors.gray[500];
    }
  };

  const dashboardStats = {
    totalLeads: userLeads?.length || 0,
    activeLeads: userLeads?.filter(lead => lead.status === 'open' || lead.status === 'in_progress').length || 0,
    completedLeads: userLeads?.filter(lead => lead.status === 'completed').length || 0,
    savedMoney: userLeads?.filter(lead => lead.status === 'completed').length * 50 || 0 // Mock calculation
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: spacing[6],
      minHeight: '100vh',
      backgroundColor: colors.gray[50]
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: spacing[8]
      }}>
        <div>
          <h1 style={{
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.gray[900],
            margin: 0
          }}>
            Ciao, {userDoc?.name || 'Utente'}! 👋
          </h1>
          <p style={{
            fontSize: typography.fontSize.lg,
            color: colors.gray[600],
            margin: `${spacing[2]} 0 0 0`
          }}>
            Gestisci i tuoi progetti {location && `a ${location}`}
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateForm(true)}
          leftIcon={<span>+</span>}
        >
          Nuovo Progetto
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        <Card variant="elevated">
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                  Progetti Totali
                </p>
                <p style={{ 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.primary[600],
                  margin: 0
                }}>
                  {dashboardStats.totalLeads}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>📊</div>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                  Progetti Attivi
                </p>
                <p style={{ 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.warning[600],
                  margin: 0
                }}>
                  {dashboardStats.activeLeads}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>⚡</div>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                  Completati
                </p>
                <p style={{ 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.success[600],
                  margin: 0
                }}>
                  {dashboardStats.completedLeads}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>✅</div>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                  Risparmiato
                </p>
                <p style={{ 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.success[600],
                  margin: 0
                }}>
                  €{dashboardStats.savedMoney}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>💰</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Create Lead Form Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: spacing[4]
        }}>
          <Card style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle>Crea Nuovo Progetto</CardTitle>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: colors.gray[400]
                  }}
                >
                  ×
                </button>
              </div>
            </CardHeader>

            <CardBody>
              <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <Input
                  label="Titolo del Progetto"
                  value={leadForm.title}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="es. Riparazione rubinetto cucina"
                  required
                />

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[2]
                  }}>
                    Categoria
                  </label>
                  <select
                    value={leadForm.category}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: `${spacing[3]} ${spacing[4]}`,
                      border: `2px solid ${colors.gray[300]}`,
                      borderRadius: '0.5rem',
                      fontSize: typography.fontSize.base,
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Seleziona categoria</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[2]
                  }}>
                    Descrizione
                  </label>
                  <textarea
                    value={leadForm.description}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrivi in dettaglio il lavoro che necessiti..."
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: `${spacing[3]} ${spacing[4]}`,
                      border: `2px solid ${colors.gray[300]}`,
                      borderRadius: '0.5rem',
                      fontSize: typography.fontSize.base,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[2]
                  }}>
                    Urgenza
                  </label>
                  <div style={{ display: 'flex', gap: spacing[3] }}>
                    {(['low', 'medium', 'high'] as const).map(urgency => (
                      <label key={urgency} style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <input
                          type="radio"
                          name="urgency"
                          value={urgency}
                          checked={leadForm.urgency === urgency}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                        />
                        <Badge 
                          variant={urgency === 'high' ? 'error' : urgency === 'medium' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {urgency === 'low' ? 'Bassa' : urgency === 'medium' ? 'Media' : 'Alta'}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[4] }}>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setShowCreateForm(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={createLoading}
                  >
                    Crea Progetto
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Projects List */}
      <div>
        <h2 style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          color: colors.gray[900],
          marginBottom: spacing[6]
        }}>
          I Tuoi Progetti
        </h2>

        {leadsLoading ? (
          <div style={{ textAlign: 'center', padding: spacing[8] }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: `4px solid ${colors.primary[200]}`,
              borderTop: `4px solid ${colors.primary[600]}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
            <p style={{ marginTop: spacing[4], color: colors.gray[600] }}>Caricamento progetti...</p>
          </div>
        ) : userLeads && userLeads.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            {userLeads.map((lead) => (
              <Card key={lead.id} variant="interactive">
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[2] }}>
                        <CardTitle>{lead.title}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(lead.status)} size="sm">
                          {getStatusText(lead.status)}
                        </Badge>
                        <Badge 
                          variant="default" 
                          size="sm"
                          style={{ 
                            backgroundColor: getUrgencyColor(lead.urgency) + '20',
                            color: getUrgencyColor(lead.urgency),
                            border: `1px solid ${getUrgencyColor(lead.urgency)}`
                          }}
                        >
                          {lead.urgency === 'high' ? '🔥 Urgente' : 
                           lead.urgency === 'medium' ? '⚡ Normale' : '🕐 Non urgente'}
                        </Badge>
                      </div>
                      
                      <CardDescription style={{ marginBottom: spacing[3] }}>
                        {lead.description}
                      </CardDescription>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: spacing[4],
                        fontSize: typography.fontSize.sm,
                        color: colors.gray[500]
                      }}>
                        <span>📍 {lead.location?.city || 'Non specificato'}</span>
                        <span>📂 {lead.category}</span>
                        <span>💬 {lead.proposals?.length || 0} proposte</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: spacing[2] }}>
                      {lead.status === 'open' && (
                        <Button variant="outline" size="sm">
                          Modifica
                        </Button>
                      )}
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => onMessageProvider?.('provider-1')}
                      >
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody style={{ textAlign: 'center', padding: spacing[12] }}>
              <div style={{ fontSize: '4rem', marginBottom: spacing[4] }}>📋</div>
              <CardTitle>Nessun Progetto Ancora</CardTitle>
              <CardDescription style={{ marginBottom: spacing[6] }}>
                Crea il tuo primo progetto per iniziare a ricevere proposte da professionisti qualificati.
              </CardDescription>
              <Button 
                variant="primary"
                onClick={() => setShowCreateForm(true)}
                leftIcon={<span>+</span>}
              >
                Crea il Primo Progetto
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};