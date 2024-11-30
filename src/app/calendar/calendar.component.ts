import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService, CalendarData } from '../service/calendar.service';

export enum CalendarEnum {
  CONTAS_A_PAGAR = "contas_a_pagar",
  CONTAS_A_RECEBER = "contas_a_receber",
  PEDIDOS_A_ENTREGAR = "pedidos_a_entregar"
}

export enum StatusEnum {
  ATIVO = "ativo",
  INATIVO = "inativo"
}

export enum CalendarVisibilityEnum {
  TODOS = "todos",
  SOMENTE_EU = "somente_eu",
  ADMINISTRADORES = "administradores"
}

interface GroupedCalendars {
  [key: string]: CalendarData[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  calendars: CalendarData[] = [];
  groupedCalendars: GroupedCalendars = {};
  selectedCalendar: CalendarData | null = null;

  constructor(private calendarService: CalendarService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getCalendars();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(calendar: CalendarData) {
    this.selectedCalendar = calendar;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedCalendar = null;
  }

  openDeleteModal(calendar: CalendarData) {
    this.selectedCalendar = calendar;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedCalendar = null;
  }

  getCalendars() {
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars;
      this.groupCalendarsByDate();
      this.cdr.detectChanges();
    });
  }

  groupCalendarsByDate() {
    this.groupedCalendars = this.calendars.reduce((groups: GroupedCalendars, calendar) => {
      const date = new Date(calendar.expirated_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(calendar);
      return groups;
    }, {});
  }

  getGroupedCalendarKeys(): string[] {
    return Object.keys(this.groupedCalendars).sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  }

  createCalendar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: CalendarData = {
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      visibility: formData.get('visibility') as string,
      expirated_at: new Date(formData.get('expirated_at') as string).toISOString(),
      description: formData.get('description') as string
    };

    this.calendarService.createCalendar(data).subscribe(response => {
      this.getCalendars(); // Atualiza a lista de calendários
      this.closeModal();
    }, error => {
      console.error('Error creating calendar', error);
    });
  }

  editCalendar(event: Event) {
    event.preventDefault();
    if (!this.selectedCalendar) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: CalendarData = {
      ...this.selectedCalendar,
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      visibility: formData.get('visibility') as string,
      expirated_at: new Date(formData.get('expirated_at') as string).toISOString(),
      description: formData.get('description') as string
    };

    this.calendarService.updateCalendar(data).subscribe(response => {
      this.getCalendars(); // Atualiza a lista de calendários
      this.closeEditModal();
    }, error => {
      console.error('Error updating calendar', error);
    });
  }

  markAsComplete(calendar: CalendarData) {
    if (!calendar.id) return;

    const updatedCalendar: CalendarData = {
      ...calendar,
      status: 'Concluido'
    };

    this.calendarService.updateCalendar(updatedCalendar).subscribe(response => {
      console.log('Calendar marked as complete', response);
      this.getCalendars(); // Atualiza a lista de calendários
    }, error => {
      console.error('Error marking calendar as complete', error);
    });
  }

  deleteCalendar() {
    if (!this.selectedCalendar || this.selectedCalendar.id === undefined) return;

    this.calendarService.deleteCalendar(this.selectedCalendar.id).subscribe(response => {
      console.log('Calendar deleted', response);
      this.getCalendars(); // Atualiza a lista de calendários
      this.closeDeleteModal();
    }, error => {
      console.error('Error deleting calendar', error);
    });
  }
}