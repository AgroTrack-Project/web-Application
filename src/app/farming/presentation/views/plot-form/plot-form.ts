import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FarmingStore } from '../../../application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { Plot } from '../../../domain/model/plot.entity';
import { PlotStatus } from '../../../domain/model/plot-status.enum';

const PERU_DEPARTMENTS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

@Component({
  selector: 'app-plot-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './plot-form.html',
  styleUrl: './plot-form.css'
})
export class PlotForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  store = inject(FarmingStore);
  identityStore = inject(IdentityStore);

  readonly departments = PERU_DEPARTMENTS;
  readonly PlotStatus = PlotStatus;

  plotId = signal<string | null>(null);
  submitted = signal(false);
  formError = signal('');
  private formInitialized = signal(false);

  plotForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    location: [PERU_DEPARTMENTS[0], Validators.required],
    sizeHectares: [0, [Validators.required, Validators.min(0.1)]],
    status: [PlotStatus.ACTIVE, Validators.required]
  });

  readonly isEditMode = computed(() => this.plotId() !== null);

  readonly currentPlot = computed(() => {
    const id = this.plotId();
    if (!id) return undefined;
    return this.store.getPlotById(id);
  });

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'plots.form.edit_title' : 'plots.form.register_title'
  );

  readonly submitLabel = computed(() =>
    this.isEditMode() ? 'plots.form.save_changes' : 'plots.form.register_plot'
  );

  readonly activeUserPlotsCount = computed(() =>
    this.store.getActiveUserPlotsCount('1')
  );

  readonly maxPlots = computed(() => {
    const user = this.identityStore.currentUser();
    return user ? user.getPlan().getMaxPlots() : 3;
  });

  readonly hasReachedPlotLimit = computed(() =>
    !this.isEditMode() && this.activeUserPlotsCount() >= this.maxPlots()
  );

  private readonly patchFormEffect = effect(() => {
    const plot = this.currentPlot();

    if (!this.isEditMode() || !plot || this.formInitialized()) {
      return;
    }

    this.plotForm.patchValue({
      name: plot.getName(),
      location: plot.getLocation(),
      sizeHectares: plot.getSizeHectares(),
      status: plot.getStatus()
    });

    this.formInitialized.set(true);
  });

  ngOnInit(): void {
    this.store.loadPlots();
    this.identityStore.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');
    this.plotId.set(id);
  }

  savePlot(): void {
    this.submitted.set(true);
    this.formError.set('');

    if (this.hasReachedPlotLimit()) {
      this.formError.set('plots.form.limit_error');
      return;
    }

    if (this.plotForm.invalid) {
      this.formError.set('plots.form.validation_error');
      return;
    }

    const formValue = this.plotForm.getRawValue();
    const id = this.plotId();

    if (id) {
      const existingPlot = this.store.getPlotById(id);

      if (!existingPlot) {
        this.formError.set('plots.form.not_found_error');
        return;
      }

      existingPlot.update(
        formValue.name.trim(),
        formValue.location,
        Number(formValue.sizeHectares)
      );

      existingPlot.setStatus(formValue.status);
      this.store.updatePlot(existingPlot);
      this.router.navigate(['/parcelas', id]);
      return;
    }

    const newPlot = new Plot(
      crypto.randomUUID(),
      formValue.name.trim(),
      formValue.location,
      Number(formValue.sizeHectares),
      PlotStatus.ACTIVE,
      '1',
      new Date().toISOString()
    );

    this.store.createPlot(newPlot);
    this.router.navigate(['/parcelas']);
  }

  cancel(): void {
    const id = this.plotId();

    if (id) {
      this.router.navigate(['/parcelas', id]);
      return;
    }

    this.router.navigate(['/parcelas']);
  }

  isFieldInvalid(fieldName: 'name' | 'sizeHectares'): boolean {
    const field = this.plotForm.controls[fieldName];
    return this.submitted() && field.invalid;
  }
}
