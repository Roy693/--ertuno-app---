import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProviderData, useBookingCreation } from '../../hooks/useFirestore';
import { useLocation } from '../../hooks/useLocation';
import Button from '../ui/Button';
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { colors, spacing, typography } from '../../styles/theme';

interface ProviderDashboardProps {
  onMessageUser?: (userId: string) => void;
  onAcceptLead?: (leadId: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  onMessageUser,
  onAcceptLead
}) => {
  const { user, userDoc } = useAuth();
  const { leads, bookings, loading } = useProviderData();
  const { createBooking, loading: bookingLoading } = useBookingCreation();
  const { location } = useLocation();

  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  // Calculate provider stats
  const stats = {
    totalEarnings: bookings?.filter(b => b.status === 'completed').length * 150 || 0, // Mock calculation
    activeBookings: bookings?.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length || 0,
    completedJobs: bookings?.filter(b => b.status === 'completed').length || 0,
    responseTime: userDoc?.responseTime || 24,
    rating: userDoc?.rating || 0,
    reviewCount: userDoc?.reviewCount || 0
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_progress': return 'warning';  
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Disponibile';
      case 'in_progress': return 'In Corso';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Annullato';
      case 'confirmed': return 'Confermato';
      case 'pending': return 'In Attesa';
      default: return status;
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🕐';
      default: return '📋';
    }
  };

  const handleAcceptLead = async (leadId: string) => {
    if (!user || !leadId) return;

    try {
      // Create a booking for the lead
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1); // Next day

      const lead = leads?.find(l => l.id === leadId);
      if (!lead) return;

      const result = await createBooking(
        leadId,
        lead.userId,
        user.uid,
        scheduledDate
      );

      if (result) {
        onAcceptLead?.(leadId);
      }
    } catch (error) {
      console.error('Error accepting lead:', error);
    }
  };

  const renderBadges = () => {
    const badges = userDoc?.badges || [];
    const allBadges = [
      { id: 'fast_responder', name: 'Risposta Rapida', icon: '⚡', condition: stats.responseTime <= 2 },
      { id: 'top_rated', name: 'Top Rated', icon: '⭐', condition: stats.rating >= 4.5 },
      { id: 'experienced', name: 'Esperto', icon: '🎖️', condition: stats.completedJobs >= 10 },
      { id: 'local_hero', name: `Eroe di ${location || 'Comiso'}`, icon: '🏆', condition: stats.completedJobs >= 5 }
    ];

    return allBadges.filter(badge => badge.condition || badges.includes(badge.id));
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
      <div style={{ marginBottom: spacing[8] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], marginBottom: spacing[4] }}>
          <Avatar
            src={userDoc?.profileImages?.[0]}
            alt={userDoc?.name}
            size="xl"
            fallback={userDoc?.name}
          />
          <div>
            <h1 style={{
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              margin: 0
            }}>
              {userDoc?.businessName || userDoc?.name} 🚀
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginTop: spacing[1] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                <span style={{ color: colors.secondary[500] }}>⭐</span>
                <span style={{ fontWeight: typography.fontWeight.medium }}>
                  {stats.rating.toFixed(1)} ({stats.reviewCount} recensioni)
                </span>
              </div>
              <span style={{ color: colors.gray[400] }}>•</span>
              <span style={{ color: colors.gray[600] }}>
                📍 {userDoc?.location?.city || location || 'Comiso'}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
          {renderBadges().map(badge => (
            <Badge key={badge.id} variant="primary" size="sm" icon={<span>{badge.icon}</span>}>
              {badge.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        <Card variant="elevated">
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: spacing[2] }}>💰</div>
              <p style={{ 
                fontSize: typography.fontSize['2xl'], 
                fontWeight: typography.fontWeight.bold, 
                color: colors.success[600],
                margin: 0
              }}>
                €{stats.totalEarnings.toLocaleString()}
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                Guadagni Totali
              </p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: spacing[2] }}>📅</div>
              <p style={{ 
                fontSize: typography.fontSize['2xl'], 
                fontWeight: typography.fontWeight.bold, 
                color: colors.primary[600],
                margin: 0
              }}>
                {stats.activeBookings}
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                Prenotazioni Attive
              </p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: spacing[2] }}>✅</div>
              <p style={{ 
                fontSize: typography.fontSize['2xl'], 
                fontWeight: typography.fontWeight.bold, 
                color: colors.success[600],
                margin: 0
              }}>
                {stats.completedJobs}
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                Lavori Completati
              </p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: spacing[2] }}>⚡</div>
              <p style={{ 
                fontSize: typography.fontSize['2xl'], 
                fontWeight: typography.fontWeight.bold, 
                color: colors.warning[600],
                margin: 0
              }}>
                {stats.responseTime}h
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                Tempo Risposta
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Content Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: spacing[8]
      }}>
        {/* Available Leads */}
        <div>
          <h2 style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[900],
            marginBottom: spacing[6]
          }}>
            Nuove Opportunità 🎯
          </h2>

          {loading ? (
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
              <p style={{ marginTop: spacing[4], color: colors.gray[600] }}>Caricamento opportunità...</p>
            </div>
          ) : leads && leads.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              {leads.slice(0, 5).map((lead) => (
                <Card key={lead.id} variant="interactive">
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[2] }}>
                          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            {getUrgencyIcon(lead.urgency)} {lead.title}
                          </CardTitle>
                          <Badge variant="primary" size="sm">
                            {lead.category}
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
                          <span>📍 {lead.location?.city}</span>
                          <span>⏱️ {lead.urgency === 'high' ? 'Urgente' : 
                                     lead.urgency === 'medium' ? 'Normale' : 'Non urgente'}</span>
                          <span>💬 {lead.proposals?.length || 0} proposte</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleAcceptLead(lead.id!)}
                          loading={bookingLoading && selectedLead === lead.id}
                        >
                          Accetta
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onMessageUser?.(lead.userId)}
                        >
                          Messaggio
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody style={{ textAlign: 'center', padding: spacing[8] }}>
                <div style={{ fontSize: '3rem', marginBottom: spacing[4] }}>🎯</div>
                <CardTitle>Nessuna Nuova Opportunità</CardTitle>
                <CardDescription>
                  Al momento non ci sono nuovi progetti nella tua zona. Controlla più tardi!
                </CardDescription>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar: Active Bookings */}
        <div>
          <h3 style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[900],
            marginBottom: spacing[4]
          }}>
            Prenotazioni Attive 📋
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {bookings && bookings.length > 0 ? (
              bookings
                .filter(booking => booking.status === 'confirmed' || booking.status === 'in_progress')
                .slice(0, 5)
                .map((booking) => (
                  <Card key={booking.id} variant="bordered">
                    <CardBody style={{ padding: spacing[4] }}>
                      <div style={{ marginBottom: spacing[2] }}>
                        <div style={{ 
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          marginBottom: spacing[1]
                        }}>
                          Prenotazione #{booking.id?.slice(-6).toUpperCase()}
                        </div>
                        <Badge variant={getStatusBadgeVariant(booking.status)} size="sm">
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>
                      
                      <p style={{ 
                        fontSize: typography.fontSize.sm,
                        color: colors.gray[600],
                        margin: 0
                      }}>
                        📅 {booking.scheduledDate?.toDate?.()?.toLocaleDateString('it-IT') || 'Data da confermare'}
                      </p>
                      
                      <div style={{ marginTop: spacing[3] }}>
                        <Button variant="outline" size="sm" fullWidth>
                          Dettagli
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
            ) : (
              <Card variant="bordered">
                <CardBody style={{ textAlign: 'center', padding: spacing[6] }}>
                  <div style={{ fontSize: '2rem', marginBottom: spacing[2] }}>📅</div>
                  <p style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[600],
                    margin: 0
                  }}>
                    Nessuna prenotazione attiva
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: spacing[6] }}>
            <h4 style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.medium,
              color: colors.gray[900],
              marginBottom: spacing[4]
            }}>
              Azioni Rapide
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              <Button variant="outline" size="sm" fullWidth>
                📊 Visualizza Analytics
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                💬 Centro Messaggi
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                ⚙️ Impostazioni Profilo
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                💳 Gestione Pagamenti
              </Button>
            </div>
          </div>
        </div>
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