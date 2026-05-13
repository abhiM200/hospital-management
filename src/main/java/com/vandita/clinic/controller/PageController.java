package com.vandita.clinic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/about", "/treatments", "/book", "/portal", "/admin", "/blog", "/contact"})
    public String index(Model model) {
        model.addAttribute("clinicName", "Dr. Vandita's Homeopathy Clinic");
        return "index"; // resolves to src/main/resources/templates/index.html
    }
}
