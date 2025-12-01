import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { IStepper } from '../types/app'

const selectionSlice = createSlice({
    name: 'component',
    initialState: {
        step: 0,
        stepper: {},
        // stepper: new Map<string, Partial<IStepper>>(),
        stepLength: 2
    },
    reducers: {
        move: (state: any) => {
            // // // console.log(state.step, state.stepLength)
            for (let index = -state.step, i = 1; index < -state.step + state.stepLength + 1; index++, i++) {
                let isReady: boolean = state.stepper[`step${i}`]?.isReady as boolean;
                let warningMessage: string = state.stepper[`step${i}`]?.warningMessage as string;
                let key: string | undefined = state.stepper[`step${i}`]?.key;
                state.stepper[`step${i}`] = {
                    positionX: index * 100,
                    isReady: isReady,
                    warningMessage: warningMessage,
                    key: key
                }
            }
        },
        setStep: (state: any, action: PayloadAction<number>) => {
            state.step = action.payload
        },
        setStepLength: (state: any, action: PayloadAction<number>) => {
            state.stepLength = action.payload
        },
        resetStep: (state: any) => {
            state.step = 0
        },
        resetStepLength: (state: any) => {
            state.stepLength = 2
        },
        setWarning: (state: any, action: PayloadAction<[number, string]>) => {
            const step: IStepper = state.stepper[`step${action.payload[0]}`]
            if (step) {
                step.isReady = false
                step.warningMessage = action.payload[1]
                state.stepper[`step${action.payload[0]}`] = step
            }
        },
        resetWarning: (state: any, action: PayloadAction<number>) => {
            const step: IStepper = state.stepper[`step${action.payload}`]
            if (step) {
                step.isReady = true
                step.warningMessage = ""
                state.stepper[`step${action.payload}`] = step
            }   
        },
    }
})

export const { move, setStep, setStepLength, setWarning, resetWarning, resetStep, resetStepLength } = selectionSlice.actions

export const selectionStorage = configureStore({
    reducer: selectionSlice.reducer
})



