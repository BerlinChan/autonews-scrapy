/**
 * Created by lx on 16/9/19.
 */
export default  {
  required: (field)=>`${field} is required.`,
  unique: (field)=>`${field} must be unique.`,
  invalidEmail: ()=>'Please input correct email address.',
  limitLettersOrNumbers: (field)=> `${field} must contain letters or/and  numbers.`,
  limitNumbers: (field)=> `${field} must contain only numbers.`,
  lenghtBetween: (min, max)=>`Total length must be between ${min} and ${max} characters.`
}
