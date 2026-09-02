import { db } from '../data/store';
import { BespokeInquiry, TradeInquiry, ContactInquiry } from '../types';

export class InquiryRepository {
  public static saveBespoke(data: Omit<BespokeInquiry, 'id' | 'submittedAt'>): BespokeInquiry {
    const record: BespokeInquiry = {
      id: `inq-b-${Date.now()}`,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.update('bespokeInquiries', (list) => {
      list.unshift(record);
      return list;
    });

    return record;
  }

  public static saveTrade(data: Omit<TradeInquiry, 'id' | 'submittedAt'>): TradeInquiry {
    const record: TradeInquiry = {
      id: `inq-t-${Date.now()}`,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.update('tradeInquiries', (list) => {
      list.unshift(record);
      return list;
    });

    return record;
  }

  public static saveContact(
    data: Omit<ContactInquiry, 'id' | 'status' | 'submittedAt'>
  ): ContactInquiry {
    const record: ContactInquiry = {
      id: `inq-c-${Date.now()}`,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.transaction((state) => {
      if (!state.contactInquiries) {
        state.contactInquiries = [];
      }
      state.contactInquiries.unshift(record);
      return record;
    });

    return record;
  }

  public static getAllBespoke(): BespokeInquiry[] {
    return db.get('bespokeInquiries') || [];
  }

  public static getAllTrade(): TradeInquiry[] {
    return db.get('tradeInquiries') || [];
  }

  public static getAllContact(): ContactInquiry[] {
    return db.get('contactInquiries') || [];
  }

  public static getAllConsolidated(): Array<{
    id: string;
    type: 'contact' | 'bespoke' | 'trade';
    sender: string;
    email: string;
    phone?: string;
    title: string;
    details: string;
    status: 'pending' | 'contacted' | 'resolved';
    submittedAt: string;
  }> {
    const contact = (db.get('contactInquiries') || []).map((c) => ({
      id: c.id,
      type: 'contact' as const,
      sender: c.name,
      email: c.email,
      phone: c.phone,
      title: c.subject,
      details: c.message,
      status: c.status || 'pending',
      submittedAt: c.submittedAt,
    }));

    const bespoke = (db.get('bespokeInquiries') || []).map((b) => ({
      id: b.id,
      type: 'bespoke' as const,
      sender: b.fullName,
      email: b.email,
      phone: undefined,
      title: `Bespoke Quote: ${b.projectType}`,
      details: b.details || 'No additional details provided.',
      status: b.status || 'pending',
      submittedAt: b.submittedAt,
    }));

    const trade = (db.get('tradeInquiries') || []).map((t) => ({
      id: t.id,
      type: 'trade' as const,
      sender: `${t.contactPerson} (${t.companyName})`,
      email: t.businessEmail,
      phone: t.phone,
      title: `Trade Application: ${t.orderVolume}`,
      details: `ID: ${t.professionalId} • ${t.projectDetails || 'Procurement inquiry'}`,
      status: t.status || 'pending',
      submittedAt: t.submittedAt,
    }));

    return [...contact, ...bespoke, ...trade].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public static updateStatus(id: string, status: 'pending' | 'contacted' | 'resolved'): boolean {
    return db.transaction((state) => {
      // Check in contact
      if (state.contactInquiries) {
        const c = state.contactInquiries.find((i) => i.id === id);
        if (c) {
          c.status = status;
          return true;
        }
      }

      // Check in bespoke
      if (state.bespokeInquiries) {
        const b = state.bespokeInquiries.find((i) => i.id === id);
        if (b) {
          b.status = status;
          return true;
        }
      }

      // Check in trade
      if (state.tradeInquiries) {
        const t = state.tradeInquiries.find((i) => i.id === id);
        if (t) {
          t.status = status;
          return true;
        }
      }

      return false;
    });
  }
}
