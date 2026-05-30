import Service from "../models/Service.js";

export const createService = async (req, res) => {
  try {
    const { title, category, description, price, experience, location } = req.body;

    const service = await Service.create({
      title,
      category,
      description,
      price,
      experience,
      location,
      provider: req.user._id,
    });

    const populated = await service.populate("provider", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllServices = async (req, res) => {
  try {
    const { category, city } = req.query;

    const filter = { isActive: true };

    if (category && category !== "Other") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (city) {
      filter.location = { $regex: city, $options: "i" };
    }

    const services = await Service.find(filter).populate("provider", "name email");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("provider", "name email");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProviderServices = async (req, res) => {
  try {
    
    const services = await Service.find({ provider: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, category, description, price, experience, location } = req.body;
    if (title) service.title = title;
    if (category) service.category = category;
    if (description) service.description = description;
    if (price) service.price = price;
    if (experience !== undefined) service.experience = experience;
    if (location !== undefined) service.location = location;

    const updated = await service.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};