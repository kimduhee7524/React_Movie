
function useForm<T>(arg0: { defaultValues: { name: string; age: number; }; }): { data: any; } {
    throw new Error("Function not implemented.");
}
// 무시하기 


const nullToEmpty = (input: string | null): string => {
    return input ?? '';
}

interface Form {
    name: string | null;
    age: number | null;
}

const form: Form = {
    name: 'John',
    age: 30,
}


const Form = ()=> {

    const {data}:{data:Form}= getFormData<Form>()

    const form = useForm<Form>({
        defaultValues: {
            name: nullToEmpty(data.name),
            age: data.age,
        }
    })
    form.data.name // 무조건 스트링
    return (
        <form>
            <input type="text" name="name" value={data.name} />
            <input type="number" name="age" value={data.age} />
            <button type="submit">Submit</button>
        </form>
    )
}
