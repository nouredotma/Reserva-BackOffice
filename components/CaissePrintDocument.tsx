import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

interface Transaction {
  id: string;
  type: 'Vente' | 'Remboursement' | 'Dépôt' | 'Retrait';
  amount: number;
  method: 'Espèces' | 'Carte' | 'Virement' | 'Chèque';
  client?: string;
  employee?: string;
  date: Date;
  note?: string;
  category?: string;
}

interface CaissePrintDocumentProps {
  transactions: Transaction[];
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalRefunds: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
    borderBottom: 1.5,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
    fontWeight: 300,
  },
  subtitle: {
    fontSize: 8,
    color: '#666',
  },
  logo: {
    width: 38,
    height: 38,
    marginBottom: 5,
  },
  refNumber: {
    fontSize: 7,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#1a1a1a',
  },
  grid4: {
    flexDirection: 'row',
    gap: 6,
  },
  grid2: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  card: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: 6,
  },
  cardHighlight: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 6,
    backgroundColor: '#f9fafb',
  },
  cardLabel: {
    fontSize: 7,
    color: '#666',
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 300,
  },
  cardUnit: {
    fontSize: 6,
    color: '#666',
    marginTop: 2,
  },
  methodCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: 6,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  methodLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
  },
  methodValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#e5e7eb',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  methodCount: {
    fontSize: 6,
    color: '#6b7280',
    marginTop: 3,
  },
  typeCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: 6,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  typeBadge: {
    fontSize: 6,
    backgroundColor: '#e5e7eb',
    color: '#374151',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  typeValue: {
    fontSize: 13,
    fontWeight: 300,
    color: '#1a1a1a',
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  performanceCard: {
    flex: 1,
  },
  performanceTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  performanceTable: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
  },
  performanceTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 4,
    fontSize: 6,
    fontWeight: 'bold',
    color: '#374151',
  },
  performanceTableRow: {
    flexDirection: 'row',
    padding: 4,
    fontSize: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  performanceTableRowAlt: {
    flexDirection: 'row',
    padding: 4,
    fontSize: 6,
    backgroundColor: '#f9fafb',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  performanceCol1: { width: '15%', color: '#6b7280' },
  performanceCol2: { width: '45%', color: '#1a1a1a' },
  performanceCol3: { width: '20%', textAlign: 'right', color: '#4b5563' },
  performanceCol4: { width: '20%', textAlign: 'right', fontWeight: 'bold', color: '#1a1a1a' },
  kpiGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: 6,
  },
  kpiLabel: {
    fontSize: 7,
    color: '#4b5563',
    marginBottom: 3,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: 300,
    color: '#1a1a1a',
  },
  kpiSubtext: {
    fontSize: 6,
    color: '#6b7280',
    marginTop: 2,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    padding: 5,
    fontSize: 6,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    padding: 5,
    backgroundColor: '#f9fafb',
    fontSize: 6,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
  },
  col1: { width: '15%' },
  col2: { width: '12%' },
  col3: { width: '12%', textAlign: 'right' },
  col4: { width: '12%' },
  col5: { width: '20%' },
  col6: { width: '15%' },
  col7: { width: '14%' },
  typeBadgeInTable: {
    fontSize: 6,
    backgroundColor: '#e5e7eb',
    color: '#374151',
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  notesBox: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: 8,
    fontSize: 7,
    color: '#374151',
    lineHeight: 1.5,
  },
  notesParagraph: {
    marginBottom: 3,
  },
  notesBold: {
    fontWeight: 'bold',
  },
  notesList: {
    marginLeft: 8,
    marginTop: 2,
  },
  notesListItem: {
    marginTop: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#999',
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
    paddingTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    fontSize: 7,
    color: '#999',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 7,
    color: '#666',
    marginBottom: 30,
  },
  signatureLine: {
    borderTopWidth: 0.5,
    borderTopColor: '#999',
    width: '100%',
    paddingTop: 4,
    alignItems: 'center',
  },
  signatureName: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  lastPageFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
  },
  lastPageFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6,
    color: '#6b7280',
  },
  lastPageFooterLeft: {
    flex: 1,
  },
  lastPageFooterRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  lastPageFooterBold: {
    fontWeight: 'bold',
  },
  lastPageFooterLine: {
    marginTop: 2,
  },
});

// PDF Document Component
const CaissePDFDocument: React.FC<CaissePrintDocumentProps> = ({ 
  transactions, 
  totalSales, 
  totalCash, 
  totalCard, 
  totalRefunds, 
  totalDeposits, 
  totalWithdrawals 
}) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refNumber = now.getTime().toString().slice(-8);

  const totalEntries = totalSales + totalDeposits;
  const totalExits = Math.abs(totalRefunds + totalWithdrawals);
  const netBalance = totalEntries - totalExits;
  const totalVirement = transactions.filter(t => t.method === 'Virement').reduce((sum, t) => sum + t.amount, 0);
  const totalCheque = transactions.filter(t => t.method === 'Chèque').reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction = transactions.length > 0 ? totalSales / transactions.filter(t => t.type === 'Vente').length : 0;
  const salesCount = transactions.filter(t => t.type === 'Vente').length;
  const refundsCount = transactions.filter(t => t.type === 'Remboursement').length;
  const depositsCount = transactions.filter(t => t.type === 'Dépôt').length;
  const withdrawalsCount = transactions.filter(t => t.type === 'Retrait').length;
  const totalTransactions = transactions.length;

  const cashCount = transactions.filter(t => t.method === 'Espèces').length;
  const cardCount = transactions.filter(t => t.method === 'Carte').length;
  const virementCount = transactions.filter(t => t.method === 'Virement').length;
  const chequeCount = transactions.filter(t => t.method === 'Chèque').length;

  // Calculate client stats
  const clientStats = transactions
    .filter(t => t.client && t.type === 'Vente')
    .reduce((acc, t) => {
      const client = t.client!;
      if (!acc[client]) acc[client] = { total: 0, count: 0 };
      acc[client].total += t.amount;
      acc[client].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
  
  const topClients = Object.entries(clientStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  // Calculate employee stats
  const employeeStats = transactions
    .filter(t => t.employee && t.type === 'Vente')
    .reduce((acc, t) => {
      const employee = t.employee!;
      if (!acc[employee]) acc[employee] = { total: 0, count: 0 };
      acc[employee].total += t.amount;
      acc[employee].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
  
  const topEmployees = Object.entries(employeeStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerRow, { flexDirection: 'row', alignItems: 'center' }]}> 
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>RAPPORT DE CAISSE</Text>
              <Text style={styles.subtitle}>WBE PRO - Gestion de Salon</Text>
              <Text style={styles.refNumber}>Réf: RPT-{refNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Image 
                src="/logo.png" 
                style={[styles.logo, { marginLeft: 12 }]} 
              />
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé Financier</Text>
          <View style={styles.grid4}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Entrées</Text>
              <Text style={styles.cardValue}>{totalEntries.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Sorties</Text>
              <Text style={styles.cardValue}>{totalExits.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.cardHighlight}>
              <Text style={styles.cardLabel}>Solde Net</Text>
              <Text style={styles.cardValue}>{netBalance.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Panier Moyen</Text>
              <Text style={styles.cardValue}>{averageTransaction.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition par Méthode de Paiement</Text>
          <View style={styles.grid2}>
            <View style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <Text style={styles.methodLabel}>Espèces</Text>
                <Text style={styles.methodValue}>{totalCash.toFixed(2)} MAD</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${totalSales > 0 ? (totalCash / totalSales) * 100 : 0}%` }]} />
              </View>
              <Text style={styles.methodCount}>{cashCount} transactions</Text>
            </View>
            <View style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <Text style={styles.methodLabel}>Carte bancaire</Text>
                <Text style={styles.methodValue}>{totalCard.toFixed(2)} MAD</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${totalSales > 0 ? (totalCard / totalSales) * 100 : 0}%` }]} />
              </View>
              <Text style={styles.methodCount}>{cardCount} transactions</Text>
            </View>
          </View>
          <View style={styles.grid2}>
            <View style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <Text style={styles.methodLabel}>Virement</Text>
                <Text style={styles.methodValue}>{totalVirement.toFixed(2)} MAD</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${totalSales > 0 ? (totalVirement / totalSales) * 100 : 0}%` }]} />
              </View>
              <Text style={styles.methodCount}>{virementCount} transactions</Text>
            </View>
            <View style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <Text style={styles.methodLabel}>Chèque</Text>
                <Text style={styles.methodValue}>{totalCheque.toFixed(2)} MAD</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${totalSales > 0 ? (totalCheque / totalSales) * 100 : 0}%` }]} />
              </View>
              <Text style={styles.methodCount}>{chequeCount} transactions</Text>
            </View>
          </View>
        </View>

        {/* Transaction Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par Type de Transaction</Text>
          <View style={styles.grid4}>
            <View style={styles.typeCard}>
              <View style={styles.typeHeader}>
                <Text style={styles.typeLabel}>Ventes</Text>
                <Text style={styles.typeBadge}>{salesCount}</Text>
              </View>
              <Text style={styles.typeValue}>{totalSales.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.typeCard}>
              <View style={styles.typeHeader}>
                <Text style={styles.typeLabel}>Remboursements</Text>
                <Text style={styles.typeBadge}>{refundsCount}</Text>
              </View>
              <Text style={styles.typeValue}>{totalRefunds.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.typeCard}>
              <View style={styles.typeHeader}>
                <Text style={styles.typeLabel}>Dépôts</Text>
                <Text style={styles.typeBadge}>{depositsCount}</Text>
              </View>
              <Text style={styles.typeValue}>{totalDeposits.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
            <View style={styles.typeCard}>
              <View style={styles.typeHeader}>
                <Text style={styles.typeLabel}>Retraits</Text>
                <Text style={styles.typeBadge}>{withdrawalsCount}</Text>
              </View>
              <Text style={styles.typeValue}>{totalWithdrawals.toFixed(2)}</Text>
              <Text style={styles.cardUnit}>MAD</Text>
            </View>
          </View>
        </View>

        {/* Performance Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse de Performance</Text>
          <View style={styles.performanceGrid}>
            {/* Top Clients */}
            <View style={styles.performanceCard}>
              <Text style={styles.performanceTitle}>Top 5 Clients</Text>
              <View style={styles.performanceTable}>
                <View style={styles.performanceTableHeader}>
                  <Text style={styles.performanceCol1}>#</Text>
                  <Text style={styles.performanceCol2}>Client</Text>
                  <Text style={styles.performanceCol3}>Ventes</Text>
                  <Text style={styles.performanceCol4}>Montant</Text>
                </View>
                {topClients.length > 0 ? topClients.map(([client, stats], index) => (
                  <View key={client} style={index % 2 === 0 ? styles.performanceTableRow : styles.performanceTableRowAlt}>
                    <Text style={styles.performanceCol1}>{index + 1}</Text>
                    <Text style={styles.performanceCol2}>{client}</Text>
                    <Text style={styles.performanceCol3}>{stats.count}</Text>
                    <Text style={styles.performanceCol4}>{stats.total.toFixed(2)}</Text>
                  </View>
                )) : (
                  <View style={styles.performanceTableRow}>
                    <Text style={{ width: '100%', textAlign: 'center', padding: 10, color: '#6b7280' }}>Aucune donnée</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Top Employees */}
            <View style={styles.performanceCard}>
              <Text style={styles.performanceTitle}>Top 5 Collaborateurs</Text>
              <View style={styles.performanceTable}>
                <View style={styles.performanceTableHeader}>
                  <Text style={styles.performanceCol1}>#</Text>
                  <Text style={styles.performanceCol2}>Collaborateur</Text>
                  <Text style={styles.performanceCol3}>Ventes</Text>
                  <Text style={styles.performanceCol4}>Montant</Text>
                </View>
                {topEmployees.length > 0 ? topEmployees.map(([employee, stats], index) => (
                  <View key={employee} style={index % 2 === 0 ? styles.performanceTableRow : styles.performanceTableRowAlt}>
                    <Text style={styles.performanceCol1}>{index + 1}</Text>
                    <Text style={styles.performanceCol2}>{employee}</Text>
                    <Text style={styles.performanceCol3}>{stats.count}</Text>
                    <Text style={styles.performanceCol4}>{stats.total.toFixed(2)}</Text>
                  </View>
                )) : (
                  <View style={styles.performanceTableRow}>
                    <Text style={{ width: '100%', textAlign: 'center', padding: 10, color: '#6b7280' }}>Aucune donnée</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicateurs Clés</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Taux de Conversion</Text>
              <Text style={styles.kpiValue}>
                {totalTransactions > 0 ? ((salesCount / totalTransactions) * 100).toFixed(1) : 0}%
              </Text>
              <Text style={styles.kpiSubtext}>{salesCount} ventes / {totalTransactions} trans.</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Panier Moyen</Text>
              <Text style={styles.kpiValue}>{averageTransaction.toFixed(2)}</Text>
              <Text style={styles.kpiSubtext}>MAD par transaction</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Taux de Remboursement</Text>
              <Text style={styles.kpiValue}>
                {totalSales > 0 ? ((Math.abs(totalRefunds) / totalSales) * 100).toFixed(1) : 0}%
              </Text>
              <Text style={styles.kpiSubtext}>{refundsCount} remboursements</Text>
            </View>
          </View>
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Second Page - Transactions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Liste des Transactions</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Date</Text>
            <Text style={styles.col2}>Type</Text>
            <Text style={styles.col3}>Montant</Text>
            <Text style={styles.col4}>Méthode</Text>
            <Text style={styles.col5}>Client</Text>
            <Text style={styles.col6}>Collaborateur</Text>
            <Text style={styles.col7}>Note</Text>
          </View>
          {transactions.map((tx, index) => (
            <View key={tx.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.col1}>
                {tx.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}{'\n'}
                <Text style={{ fontSize: 7, color: '#6b7280' }}>
                  {tx.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Text>
              <Text style={styles.col2}>{tx.type}</Text>
              <Text style={[styles.col3, { color: tx.amount < 0 ? '#6b7280' : '#1a1a1a', fontWeight: 'bold' }]}>
                {tx.amount.toFixed(2)}
              </Text>
              <Text style={styles.col4}>{tx.method}</Text>
              <Text style={styles.col5}>{tx.client || '-'}</Text>
              <Text style={styles.col6}>{tx.employee || '-'}</Text>
              <Text style={[styles.col7, { color: '#6b7280' }]}>{tx.note || '-'}</Text>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text style={{ width: '27%' }}>TOTAL:</Text>
            <Text style={{ width: '12%', textAlign: 'right' }}>{netBalance.toFixed(2)} MAD</Text>
            <Text style={{ width: '61%' }}></Text>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 20, color: '#1a1a1a' }}>
          </Text>
          <Text style={styles.sectionTitle}>Notes de Clôture</Text>
          <View style={styles.notesBox}>
            <Text style={styles.notesParagraph}>
              Ce rapport présente une vue complète de l&apos;activité de caisse pour la période indiquée.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Préparé par</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>Responsable de caisse</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Vérifié par</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>Responsable financier</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Approuvé par</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>Direction</Text>
            </View>
          </View>
        </View>

        {/* Last Page Footer */}
        <View style={styles.lastPageFooter}>
          <View style={styles.lastPageFooterRow}>
            <View style={styles.lastPageFooterLeft}>
              <Text style={styles.lastPageFooterBold}>Document généré le:</Text>
              <Text style={styles.lastPageFooterLine}>{new Date().toLocaleString('fr-FR')}</Text>
              <Text style={[styles.lastPageFooterBold, { marginTop: 5 }]}>Système:</Text>
              <Text style={styles.lastPageFooterLine}>WBE PRO v1.0</Text>
            </View>
            <View style={styles.lastPageFooterRight}>
              <Text style={styles.lastPageFooterBold}>Classification:</Text>
              <Text style={styles.lastPageFooterLine}>Confidentiel</Text>
              <Text style={[styles.lastPageFooterLine, { marginTop: 5 }]}>© {new Date().getFullYear()} WBE PRO</Text>
            </View>
          </View>
        </View>
        
        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

// Export function to generate and download PDF
export const generateCaissePDF = async (props: CaissePrintDocumentProps) => {
  const blob = await pdf(<CaissePDFDocument {...props} />).toBlob();
  saveAs(blob, `rapport-caisse-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Dummy component for ref compatibility (not used for PDF generation)
export const CaissePrintDocument = React.forwardRef<HTMLDivElement, CaissePrintDocumentProps>(
  (props, ref) => {
    return <div ref={ref} style={{ display: 'none' }} />;
  }
);

CaissePrintDocument.displayName = 'CaissePrintDocument';
