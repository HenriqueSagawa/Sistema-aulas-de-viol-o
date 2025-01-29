import { NextResponse } from "next/server"
import { db } from "@/services/firebaseConnection"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const aulasRef = collection(db, "aulas")
        
        const novaAula = {
            ...body,
            data: new Date(body.data).toISOString(),
            createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(aulasRef, novaAula)
        
        return NextResponse.json({ 
            id: docRef.id,
            ...novaAula
        }, { status: 201 })

    } catch (error) {
        console.error("Erro ao salvar aula:", error)
        return NextResponse.json({ 
            error: "Erro ao salvar aula" 
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const turmaId = searchParams.get('turmaId')

        if (!turmaId) {
            return NextResponse.json({ 
                error: "ID da turma é obrigatório" 
            }, { status: 400 })
        }

        const aulasRef = collection(db, "aulas")
        const q = query(aulasRef, where("turmaId", "==", turmaId))
        const querySnapshot = await getDocs(q)
        
        const aulas = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            data: doc.data().data
        }))

        return NextResponse.json({ aulas }, { status: 200 })

    } catch (error) {
        console.error("Erro ao buscar aulas:", error)
        return NextResponse.json({ 
            error: "Erro ao buscar aulas" 
        }, { status: 500 })
    }
} 