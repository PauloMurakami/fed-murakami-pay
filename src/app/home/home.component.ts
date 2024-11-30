import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { CalendarData, CalendarService } from '../service/calendar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  calendarsToday: CalendarData[] = [];
  isDetailModalOpen = false;
  selectedCalendar: CalendarData | null = null;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.getCalendarsToday();
  }

  getCalendarsToday() {
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendarsToday = calendars.filter(calendar => {
        const today = new Date();
        const calendarDate = new Date(calendar.expirated_at);
        return calendarDate.toDateString() === today.toDateString();
      });
    });
  }

  openDetailModal(calendar: CalendarData) {
    this.selectedCalendar = calendar;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedCalendar = null;
  }
}
