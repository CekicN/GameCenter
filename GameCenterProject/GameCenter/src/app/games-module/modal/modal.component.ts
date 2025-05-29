import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GameModel } from '../dto/game.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit{
  isModalOpen: string = "false";
  gameForm!:FormGroup;
  //editGameForm!:FormGroup;
  step = 1;
  file!:File[];
  game!: GameModel;
  constructor(private fb: FormBuilder,private gameService:GamesService){}

  ngOnInit(): void {
    this.gameService.isOpenedModal$.subscribe(state => {
      this.isModalOpen = state
      if(state != "add" && state != "false")
      {
            const title = this.isModalOpen.split("/")[2]
            const description = this.isModalOpen.split("/")[3]
            this.gameForm.patchValue({
              title,
              description
            })
      }
    });
    this.gameForm=this.fb.group({
      title: ['',[Validators.required]],
      description:['',[Validators.required]]
    })
    }

   closeModal() {
    if(this.step == 2)
      this.gameService.deleteGame(this.gameService.getGameId());
    this.gameService.closeModal();
    this.step = 1;
    this.gameForm.reset();
  }

  next()
  {
    if (this.gameForm.valid) {
      this.gameService.addGame(this.gameForm.value).subscribe(data => {
        this.gameService.setGame(data);
        this.step = 2;
      })
    } else {
      this.gameForm.markAllAsTouched();
    }
  }
  prev()
  {
    this.gameService.deleteGame(this.gameService.getGameId());
    this.step = 1;
  }
  onFileSelected(event:Event)
  {
      const input = event.target as HTMLInputElement;
      if (input.files?.length) {
        this.file = []
        for(var i = 0; i< input.files.length; i++)
        {
          const fileItem = input.files.item(i);
          if (fileItem !== null) {
            this.file.push(fileItem);
        }
      }
    }
  }

  submit()
  {
      this.gameService.uploadGameImages(this.file).subscribe(data => {
        this.closeModal();
        this.step = 1;
        this.gameForm.reset();
      })
  }
  editGame(){
    const id = Number.parseInt(this.isModalOpen.split("/")[1])

    console.log(this.gameForm)
    if (this.gameForm.valid) {
      this.gameService.updateGame(id, this.gameForm.value).subscribe(data => {
        this.closeModal();
        this.gameForm.reset();
      })
    } else {
      this.gameForm.markAllAsTouched();
    }
  }
  private validateAllFormsFields(formGroup:FormGroup){
      Object.keys(formGroup.controls).forEach(field=>{
        const control = formGroup.get(field);
        if(control instanceof FormControl){
          control.markAsDirty({
            onlySelf:true
          });
        }else if(control instanceof FormGroup){
          this.validateAllFormsFields(control);
        }
      })
    }
}
