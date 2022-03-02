const router=require('express').Router();
const Notes=require('../models/Note');
const { body, validationResult } = require('express-validator');
const fetchUser=require('../middleware/fetchUser')


router.get('/getallnotes',fetchUser,async (req,res)=>{

    try {
        const notes=await Notes.find({user:req.user.id});
        res.json(notes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error Occured");
    }
})

router.post('/addnotes', fetchUser,
[body('title', 'Enter a valid title').isLength({ min: 3 }),
body('description', 'Enter a valid description').isLength({ min: 5 }),]
,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    //return res.json({hello:'hello'});
    //console.log(req);
    try {
        //console.log(req.data);
   const {title,description,tag}=req.body;
//    const user=req.user;
  const note= await new Notes({ title,description,tag,user:req.user.id});
  const savedNote=await note.save();
   return res.status(200).json(savedNote);
} catch (error) {
    console.log(error.message);
  return   res.status(500).send("Some error Occured");
}
})

router.delete('/deletenote/:id',fetchUser, async (req,res)=>{
    
    try {
        const delte= await Notes.findByIdAndDelete(req.params.id);
        //console.log(delte);
       return  res.send("Deleted");
     } catch (error) {
         console.log(error.message);
       return   res.status(500).send("Some error Occured");
     }
     })


router.put('/updatenote/:id',fetchUser, async (req,res)=>{
    
    try {
        const { title, description, tag } = req.body;
        //Create a newNote object

        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        const updatenote= await Notes.findByIdAndUpdate(req.params.id,{$set:newNote});
      return   res.json(updatenote);
       
     } catch (error) {
         console.log(error.message);
        return  res.status(500).send("Some error Occured");
     }
     })





module.exports=router;